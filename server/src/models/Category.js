const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    icon: { type: String, required: true },
    bgColor: { type: String, default: '#F8F8F8' },
    imageUrl: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

categorySchema.index({ order: 1 })
categorySchema.index({ isActive: 1 })

module.exports = mongoose.model('Category', categorySchema)
