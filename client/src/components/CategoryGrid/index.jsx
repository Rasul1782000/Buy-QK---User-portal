import { useState, useEffect } from 'react'
import { getCategories } from '../../api/client'
import CategoryCard from '../CategoryCard'
import './CategoryGrid.css'

const fallbackCategories = [
  { _id: '1', name: 'Paan Corner', icon: '🫰', slug: 'paan-corner', bgColor: '#FFE5E5' },
  { _id: '2', name: 'Dairy, Bread & Eggs', icon: '🥛', slug: 'dairy-bread-eggs', bgColor: '#E8F5E9' },
  { _id: '3', name: 'Fruits & Vegetables', icon: '🥦', slug: 'fruits-vegetables', bgColor: '#E8F5E9' },
  { _id: '4', name: 'Cold Drinks & Juices', icon: '🧃', slug: 'cold-drinks-juices', bgColor: '#FFF3E0' },
  { _id: '5', name: 'Snacks & Munchies', icon: '🍿', slug: 'snacks-munchies', bgColor: '#FFF8E1' },
  { _id: '6', name: 'Breakfast & Instant Food', icon: '🥣', slug: 'breakfast-instant-food', bgColor: '#FFF3E0' },
  { _id: '7', name: 'Sweet Tooth', icon: '🍫', slug: 'sweet-tooth', bgColor: '#FCE4EC' },
  { _id: '8', name: 'Bakery & Biscuits', icon: '🍪', slug: 'bakery-biscuits', bgColor: '#FFF8E1' },
  { _id: '9', name: 'Tea, Coffee & Health Drink', icon: '☕', slug: 'tea-coffee-health-drink', bgColor: '#EFEBE9' },
  { _id: '10', name: 'Atta, Rice & Dal', icon: '🌾', slug: 'atta-rice-dal', bgColor: '#FFF8E1' },
  { _id: '11', name: 'Baby Care', icon: '👶', slug: 'baby-care', bgColor: '#E3F2FD' },
  { _id: '12', name: 'Pharma & Wellness', icon: '💊', slug: 'pharma-wellness', bgColor: '#E8F5E9' },
  { _id: '13', name: 'Cleaning Essentials', icon: '🧹', slug: 'cleaning-essentials', bgColor: '#E3F2FD' },
  { _id: '14', name: 'Personal Care', icon: '🧴', slug: 'personal-care', bgColor: '#F3E5F5' },
  { _id: '15', name: 'Home & Office', icon: '🏠', slug: 'home-office', bgColor: '#ECEFF1' },
  { _id: '16', name: 'Pet Care', icon: '🐕', slug: 'pet-care', bgColor: '#FFF3E0' },
]

export default function CategoryGrid() {
  const [categories, setCategories] = useState(fallbackCategories)

  useEffect(() => {
    getCategories()
      .then((res) => {
        if (res.data?.length) setCategories(res.data)
      })
      .catch(() => {})
  }, [])

  return (
    <section className="category-grid max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="category-grid__header flex items-center justify-between mb-5">
        <h2 className="category-grid__title text-lg sm:text-xl font-extrabold text-text-primary tracking-tight">
          Shop by Category
        </h2>
        <a href="/categories" className="category-grid__see-all text-brand-green text-sm font-semibold hover:underline">
          See all
        </a>
      </div>

      <div className="category-grid__list grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {categories.map((cat) => (
          <CategoryCard key={cat._id} category={cat} />
        ))}
      </div>
    </section>
  )
}
