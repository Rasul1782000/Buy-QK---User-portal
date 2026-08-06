const express = require('express')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const config = require('../config')
const { isUsingMongo, findUserByIdentifier: findStoreUserByIdentifier, createUser: createStoreUser, getStore: getStoreData, getUserById: getStoreUserById } = require('../store')
const { protect, setAuthCookie, clearAuthCookie } = require('../middleware/auth')

const router = express.Router()

function generateToken(userId) {
  return jwt.sign({ id: userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
    issuer: 'buyqk',
    audience: 'buyqk-user',
  })
}

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    role: user.role || 'user',
  }
}

function maskIdentifier(identifier) {
  if (!identifier) return ''
  if (identifier.includes('@')) {
    const [local, domain] = identifier.split('@')
    return `${local.slice(0, 2)}***@${domain}`
  }
  return `${identifier.slice(0, 2)}****${identifier.slice(-2)}`
}

async function findUserByIdentifier(identifier) {
  if (isUsingMongo()) {
    if (identifier.includes('@')) {
      return User.findOne({ email: identifier.toLowerCase() })
    }
    return User.findOne({ phone: identifier })
  }
  return findStoreUserByIdentifier(identifier)
}

async function findUserById(id) {
  if (isUsingMongo()) {
    return User.findById(id)
  }
  return getStoreUserById(id)
}

async function saveUser(user) {
  if (isUsingMongo()) {
    return user.save({ validateBeforeSave: false })
  }
  user.updatedAt = new Date()
  return user
}

async function comparePassword(user, candidatePassword) {
  if (isUsingMongo()) {
    return user.comparePassword(candidatePassword)
  }
  return bcrypt.compare(candidatePassword, user.password)
}

function generateOtp() {
  return crypto.randomInt(100000, 1000000).toString()
}

function hashOtp(otp) {
  return crypto.createHash('sha256').update(otp).digest('hex')
}

async function issueOtp(user, identifier) {
  const now = Date.now()
  if (user.otpSentAt && now - new Date(user.otpSentAt).getTime() < config.otpCooldownMs) {
    const remaining = Math.ceil((config.otpCooldownMs - (now - new Date(user.otpSentAt).getTime())) / 1000)
    const error = new Error(`Please wait ${remaining}s before requesting a new code`)
    error.statusCode = 429
    throw error
  }

  const otp = generateOtp()
  user.otpHash = hashOtp(otp)
  user.otpExpires = new Date(now + config.otpTtlMs)
  user.otpAttempts = 0
  user.otpFor = identifier
  user.otpSentAt = new Date(now)
  await saveUser(user)

  if (!config.isProduction) {
    console.log(`[OTP] For ${identifier}: ${otp}`)
  }

  return otp
}

router.post('/demo-login', async (req, res) => {
  if (config.isProduction) {
    return res.status(404).json({ message: 'Not found' })
  }

  try {
    const { email, password, role } = req.body

    let user
    if (email) {
      user = await findUserByIdentifier(email.toLowerCase())
    } else if (role === 'admin') {
      user = await findUserByIdentifier('admin@buyqk.com')
    } else {
      user = await findUserByIdentifier('demo@buyqk.com')
    }

    if (!user) {
      return res.status(401).json({ message: 'Demo user not found' })
    }

    if (password && !(await comparePassword(user, password))) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = generateToken(user._id)
    setAuthCookie(res, token)

    res.json({ token, user: publicUser(user) })
  } catch (err) {
    res.status(500).json({ message: 'Server error. Please try again.' })
  }
})

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' })
    }

    const existing = await findUserByIdentifier(email.toLowerCase())
    if (existing) {
      return res.status(409).json({ message: 'An account with this email or phone already exists' })
    }

    if (phone && (await findUserByIdentifier(phone.trim()))) {
      return res.status(409).json({ message: 'An account with this email or phone already exists' })
    }

    let user
    if (isUsingMongo()) {
      user = await User.create({ name, email, password, phone: phone ? phone.trim() : undefined })
    } else {
      user = createStoreUser({ name, email, password, phone: phone ? phone.trim() : undefined, role: 'user' })
    }

    const token = generateToken(user._id)
    setAuthCookie(res, token)

    res.status(201).json({ token, user: publicUser(user) })
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'An account with this email or phone already exists' })
    }
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message)
      return res.status(400).json({ message: messages[0] })
    }
    res.status(500).json({ message: 'Server error. Please try again.' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const { phone } = req.body

    if ((!email && !phone) || !password) {
      return res.status(400).json({ message: 'Email/phone and password are required' })
    }

    const identifier = email ? email.toLowerCase() : phone.trim()
    const user = await findUserByIdentifier(identifier)

    if (!user || !(await comparePassword(user, password))) {
      return res.status(401).json({ message: 'Invalid email/phone or password' })
    }

    const otp = await issueOtp(user, identifier)

    res.json({
      otpRequired: true,
      otpSentTo: maskIdentifier(identifier),
      ...(!config.isProduction ? { devOtp: otp } : {}),
    })
  } catch (err) {
    if (err.statusCode === 429) {
      return res.status(429).json({ message: err.message })
    }
    res.status(500).json({ message: 'Server error. Please try again.' })
  }
})

router.post('/send-otp', async (req, res) => {
  try {
    const identifier = req.body.email ? req.body.email.toLowerCase() : req.body.phone ? req.body.phone.trim() : null
    if (!identifier) {
      return res.status(400).json({ message: 'Email or phone is required' })
    }

    const user = await findUserByIdentifier(identifier)
    if (!user) {
      return res.json({ message: 'If an account exists with this identifier, a verification code will be sent.' })
    }

    const otp = await issueOtp(user, identifier)
    res.json({
      message: 'Verification code sent',
      otpSentTo: maskIdentifier(identifier),
      ...(!config.isProduction ? { devOtp: otp } : {}),
    })
  } catch (err) {
    if (err.statusCode === 429) {
      return res.status(429).json({ message: err.message })
    }
    res.status(500).json({ message: 'Server error. Please try again.' })
  }
})

router.post('/verify-otp', async (req, res) => {
  try {
    const { otp } = req.body
    const identifier = req.body.email ? req.body.email.toLowerCase() : req.body.phone ? req.body.phone.trim() : null

    if (!otp || !identifier) {
      return res.status(400).json({ message: 'Verification code and email/phone are required' })
    }

    const user = await findUserByIdentifier(identifier)
    if (!user || !user.otpHash || !user.otpExpires) {
      return res.status(400).json({ message: 'No verification code found. Please request a new one.' })
    }

    if (new Date(user.otpExpires).getTime() < Date.now()) {
      return res.status(400).json({ message: 'This code has expired. Please request a new one.' })
    }

    if (user.otpAttempts >= config.otpMaxAttempts) {
      return res.status(429).json({ message: 'Too many incorrect attempts. Please request a new code.' })
    }

    if (user.otpHash !== hashOtp(otp)) {
      user.otpAttempts = (user.otpAttempts || 0) + 1
      await saveUser(user)
      return res.status(400).json({ message: 'Incorrect code. Please try again.' })
    }

    user.otpHash = undefined
    user.otpExpires = undefined
    user.otpAttempts = undefined
    user.otpFor = undefined
    user.otpSentAt = undefined
    await saveUser(user)

    const token = generateToken(user._id)
    setAuthCookie(res, token)

    res.json({ token, user: publicUser(user) })
  } catch (err) {
    res.status(500).json({ message: 'Server error. Please try again.' })
  }
})

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: 'Email is required' })
    }

    const user = await findUserByIdentifier(email.toLowerCase())

    if (!user) {
      return res.json({ message: 'If an account exists with this email, you will receive a reset link.' })
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex')

    user.resetPasswordToken = resetTokenHash
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000
    await saveUser(user)

    if (config.isProduction) {
      return res.json({ message: 'If an account exists with this email, you will receive a reset link.' })
    }

    console.log(`[PASSWORD RESET] For ${email}: ${resetToken}`)
    res.json({
      message: 'Password reset link sent to your email',
      resetToken,
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error. Please try again.' })
  }
})

router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body

    if (!token || !password) {
      return res.status(400).json({ message: 'Token and new password are required' })
    }

    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex')

    let user
    if (isUsingMongo()) {
      user = await User.findOne({
        resetPasswordToken: resetTokenHash,
        resetPasswordExpires: { $gt: Date.now() },
      }).select('+password +resetPasswordToken +resetPasswordExpires')
    } else {
      user = getStoreData().users.find(
        (u) => u.resetPasswordToken === resetTokenHash && u.resetPasswordExpires > Date.now()
      )
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' })
    }

    if (isUsingMongo()) {
      user.password = password
      user.resetPasswordToken = undefined
      user.resetPasswordExpires = undefined
      await user.save()
    } else {
      const hashed = await bcrypt.hash(password, config.bcryptRounds)
      user.password = hashed
      user.resetPasswordToken = undefined
      user.resetPasswordExpires = undefined
      user.updatedAt = new Date()
    }

    const newToken = generateToken(user._id)
    setAuthCookie(res, newToken)

    res.json({
      message: 'Password reset successful',
      token: newToken,
      user: publicUser(user),
    })
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message)
      return res.status(400).json({ message: messages[0] })
    }
    res.status(500).json({ message: 'Server error. Please try again.' })
  }
})

router.get('/me', protect, async (req, res) => {
  res.json({ user: publicUser(req.user) })
})

router.post('/logout', (req, res) => {
  clearAuthCookie(res)
  res.json({ message: 'Logged out successfully' })
})

module.exports = router
