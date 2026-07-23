const mongoose = require('mongoose')

const popularSearchSchema = new mongoose.Schema(
  {
    term: { type: String, required: true, unique: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

popularSearchSchema.index({ order: 1, isActive: 1 })

module.exports = mongoose.model('PopularSearch', popularSearchSchema)
