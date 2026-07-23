const Category = require('./models/Category')
const Banner = require('./models/Banner')
const PopularSearch = require('./models/PopularSearch')

const categories = [
  { name: 'Paan Corner', slug: 'paan-corner', icon: '🫰', bgColor: '#FFE5E5', order: 1 },
  { name: 'Dairy, Bread & Eggs', slug: 'dairy-bread-eggs', icon: '🥛', bgColor: '#E8F5E9', order: 2 },
  { name: 'Fruits & Vegetables', slug: 'fruits-vegetables', icon: '🥦', bgColor: '#E8F5E9', order: 3 },
  { name: 'Cold Drinks & Juices', slug: 'cold-drinks-juices', icon: '🧃', bgColor: '#FFF3E0', order: 4 },
  { name: 'Snacks & Munchies', slug: 'snacks-munchies', icon: '🍿', bgColor: '#FFF8E1', order: 5 },
  { name: 'Breakfast & Instant Food', slug: 'breakfast-instant-food', icon: '🥣', bgColor: '#FFF3E0', order: 6 },
  { name: 'Sweet Tooth', slug: 'sweet-tooth', icon: '🍫', bgColor: '#FCE4EC', order: 7 },
  { name: 'Bakery & Biscuits', slug: 'bakery-biscuits', icon: '🍪', bgColor: '#FFF8E1', order: 8 },
  { name: 'Tea, Coffee & Health Drink', slug: 'tea-coffee-health-drink', icon: '☕', bgColor: '#EFEBE9', order: 9 },
  { name: 'Atta, Rice & Dal', slug: 'atta-rice-dal', icon: '🌾', bgColor: '#FFF8E1', order: 10 },
  { name: 'Baby Care', slug: 'baby-care', icon: '👶', bgColor: '#E3F2FD', order: 11 },
  { name: 'Pharma & Wellness', slug: 'pharma-wellness', icon: '💊', bgColor: '#E8F5E9', order: 12 },
  { name: 'Cleaning Essentials', slug: 'cleaning-essentials', icon: '🧹', bgColor: '#E3F2FD', order: 13 },
  { name: 'Personal Care', slug: 'personal-care', icon: '🧴', bgColor: '#F3E5F5', order: 14 },
  { name: 'Home & Office', slug: 'home-office', icon: '🏠', bgColor: '#ECEFF1', order: 15 },
  { name: 'Pet Care', slug: 'pet-care', icon: '🐕', bgColor: '#FFF3E0', order: 16 },
]

const banners = [
  {
    title: 'Flat 20% OFF',
    subtitle: 'On all grocery essentials. Use code BUYQK20',
    ctaText: 'Shop Now',
    ctaLink: '/promos/buyqk20',
    bgColor: '#0C831F',
    textColor: '#FFFFFF',
    order: 1,
  },
  {
    title: 'Fresh Fruits & Veggies',
    subtitle: 'Farm fresh produce delivered in 10 minutes',
    ctaText: 'Order Now',
    ctaLink: '/category/fruits-vegetables',
    bgColor: '#51AA1B',
    textColor: '#FFFFFF',
    order: 2,
  },
  {
    title: 'Daily Dairy Deals',
    subtitle: 'Milk, Curd, Paneer & more at lowest prices',
    ctaText: 'Explore',
    ctaLink: '/category/dairy-bread-eggs',
    bgColor: '#F8CB46',
    textColor: '#1A1A2E',
    order: 3,
  },
]

const popularSearches = [
  { term: 'Milk', order: 1 },
  { term: 'Bread', order: 2 },
  { term: 'Sugar', order: 3 },
  { term: 'Butter', order: 4 },
  { term: 'Paneer', order: 5 },
  { term: 'Chocolate', order: 6 },
  { term: 'Rice', order: 7 },
  { term: 'Eggs', order: 8 },
]

async function seedDb() {
  const existingCategories = await Category.countDocuments()
  if (existingCategories > 0) {
    console.log('Database already seeded, skipping...')
    return
  }

  await Category.insertMany(categories)
  console.log(`Seeded ${categories.length} categories`)

  await Banner.insertMany(banners)
  console.log(`Seeded ${banners.length} banners`)

  await PopularSearch.insertMany(popularSearches)
  console.log(`Seeded ${popularSearches.length} popular searches`)
}

module.exports = { seedDb, categories, banners, popularSearches }
