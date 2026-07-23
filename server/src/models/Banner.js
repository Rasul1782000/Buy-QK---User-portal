const mongoose = require('mongoose')

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    ctaText: { type: String, default: 'Shop Now' },
    ctaLink: { type: String, default: '#' },
    imageUrl: { type: String, default: '' },
    bgColor: { type: String, default: '#0C831F' },
    textColor: { type: String, default: '#FFFFFF' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: null },
  },
  { timestamps: true }
)

bannerSchema.index({ order: 1, isActive: 1 })

module.exports = mongoose.model('Banner', bannerSchema)
