require('dotenv').config()

const env = process.env.NODE_ENV || 'development'
const isProduction = env === 'production'

const jwtSecret = process.env.JWT_SECRET
if (isProduction && !jwtSecret) {
  throw new Error('JWT_SECRET environment variable is required in production')
}

module.exports = {
  env,
  isProduction,
  port: process.env.PORT || 5001,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/buyqk',
  corsOrigin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
    : ['http://localhost:5173'],
  jwtSecret: jwtSecret || 'buyqk-dev-secret-not-for-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  cookieSecure: isProduction,
  bcryptRounds: 12,
  otpTtlMs: 10 * 60 * 1000,
  otpMaxAttempts: 5,
  otpCooldownMs: 60 * 1000,
}
