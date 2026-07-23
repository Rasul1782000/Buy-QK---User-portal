const express = require('express')
const router = express.Router()
const { isUsingMongo, getStore } = require('../store')

router.get('/popular', async (req, res) => {
  if (isUsingMongo()) {
    const PopularSearch = require('../models/PopularSearch')
    const searches = await PopularSearch.find({ isActive: true }).sort({ order: 1 })
    return res.json(searches)
  }

  const store = getStore()
  if (!store.popularSearches.length) return res.status(500).json({ error: 'No data' })
  return res.json(store.popularSearches.filter((s) => s.isActive).sort((a, b) => a.order - b.order))
})

module.exports = router
