const express = require('express')
const router = express.Router()
const { isUsingMongo, getStore } = require('../store')

router.get('/', async (req, res) => {
  if (isUsingMongo()) {
    const Category = require('../models/Category')
    const categories = await Category.find({ isActive: true }).sort({ order: 1 })
    return res.json(categories)
  }

  const store = getStore()
  if (!store.categories.length) return res.status(500).json({ error: 'No data' })
  return res.json(store.categories.filter((c) => c.isActive).sort((a, b) => a.order - b.order))
})

router.get('/:slug', async (req, res) => {
  if (isUsingMongo()) {
    const Category = require('../models/Category')
    const category = await Category.findOne({ slug: req.params.slug, isActive: true })
    if (!category) return res.status(404).json({ error: 'Category not found' })
    return res.json(category)
  }

  const cat = getStore().categories.find((c) => c.slug === req.params.slug)
  if (!cat) return res.status(404).json({ error: 'Category not found' })
  return res.json(cat)
})

module.exports = router
