const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const rateLimit = require('express-rate-limit')
const config = require('./config')
const { seedDb } = require('./seed')

const categoryRoutes = require('./routes/categories')
const bannerRoutes = require('./routes/banners')
const searchRoutes = require('./routes/search')
const authRoutes = require('./routes/auth')

const app = express()

app.set('trust proxy', 1)

app.use(helmet())
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
)
app.use(morgan(config.isProduction ? 'combined' : 'dev'))
app.use(express.json({ limit: '100kb' }))
app.use(cookieParser())

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests. Please try again later.' },
})

app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/banners', bannerRoutes)
app.use('/api/search', searchRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'BuyQK API', timestamp: new Date().toISOString() })
})

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.statusCode || 500).json({ message: err.message || 'Server error. Please try again.' })
})

async function startServer() {
  try {
    const mongoose = require('mongoose')
    await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 3000 })
    console.log('Connected to local MongoDB')
    const { setMongoMode } = require('./store')
    setMongoMode()
    await seedDb()
    const { seedUsers } = require('./seed')
    await seedUsers()
  } catch {
    console.log('MongoDB not available — using in-memory data store')
    const { initMemoryStore } = require('./store')
    initMemoryStore()
  }

  const { isUsingMongo } = require('./store')
  app.listen(config.port, () => {
    console.log(`BuyQK server running on port ${config.port} [${isUsingMongo() ? 'MongoDB' : 'in-memory'}] [${config.env}]`)
  })
}

startServer().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
