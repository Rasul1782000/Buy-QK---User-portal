const express = require('express')
const cors = require('cors')
const config = require('./config')
const { seedDb } = require('./seed')

const categoryRoutes = require('./routes/categories')
const bannerRoutes = require('./routes/banners')
const searchRoutes = require('./routes/search')

const app = express()

app.use(cors({ origin: config.corsOrigin, credentials: true }))
app.use(express.json())

app.use('/api/categories', categoryRoutes)
app.use('/api/banners', bannerRoutes)
app.use('/api/search', searchRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'BuyQK API', timestamp: new Date().toISOString() })
})

async function startServer() {
  try {
    const mongoose = require('mongoose')
    await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 3000 })
    console.log('Connected to local MongoDB')
    const { setMongoMode } = require('./store')
    setMongoMode()
    await seedDb()
  } catch {
    console.log('MongoDB not available — using in-memory data store')
    const { initMemoryStore } = require('./store')
    initMemoryStore()
  }

  const { isUsingMongo } = require('./store')
  app.listen(config.port, () => {
    console.log(`BuyQK server running on port ${config.port} [${isUsingMongo() ? 'MongoDB' : 'in-memory'}]`)
  })
}

startServer().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
