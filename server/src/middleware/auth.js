const jwt = require('jsonwebtoken')
const config = require('../config')
const { isUsingMongo, getUserById: getStoreUserById } = require('../store')

const COOKIE_NAME = 'buyqk_token'

function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: config.cookieSecure,
    sameSite: 'lax',
    maxAge: config.jwtExpiresIn === '7d' ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000,
    path: '/',
  })
}

function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, secure: config.cookieSecure, sameSite: 'lax', path: '/' })
}

function getToken(req) {
  if (req.cookies && req.cookies[COOKIE_NAME]) return req.cookies[COOKIE_NAME]

  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) return authHeader.split(' ')[1]

  return null
}

async function protect(req, res, next) {
  const token = getToken(req)
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' })
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret)

    let user
    if (isUsingMongo()) {
      const User = require('../models/User')
      user = await User.findById(decoded.id)
    } else {
      user = getStoreUserById(decoded.id)
    }

    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }
    req.user = user
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired, please log in again' })
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' })
    }
    return res.status(500).json({ message: 'Server error' })
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' })
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission to perform this action' })
    }
    next()
  }
}

module.exports = { protect, requireRole, setAuthCookie, clearAuthCookie, COOKIE_NAME }
