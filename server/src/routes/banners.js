const express = require('express')
const router = express.Router()
const { isUsingMongo, getStore } = require('../store')

router.get('/', async (req, res) => {
  if (isUsingMongo()) {
    const Banner = require('../models/Banner')
    const now = new Date()
    const banners = await Banner.find({
      isActive: true,
      startDate: { $lte: now },
      $or: [{ endDate: null }, { endDate: { $gte: now } }],
    }).sort({ order: 1 })
    return res.json(banners)
  }

  const store = getStore()
  if (!store.banners.length) return res.status(500).json({ error: 'No data' })
  return res.json(store.banners.filter((b) => b.isActive).sort((a, b) => a.order - b.order))
})

module.exports = router
