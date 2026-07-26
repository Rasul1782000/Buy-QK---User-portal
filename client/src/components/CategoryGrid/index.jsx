import { useState, useEffect } from 'react'
import { getCategories } from '../../api/client'
import { useTranslation } from '../../translations'
import CategoryCard from '../CategoryCard'
import './CategoryGrid.css'

const FALLBACK_CATEGORIES = [
  { _id: '1', nameKey: 'category.paan', icon: '🫰', slug: 'paan-corner', bgColor: '#FFE5E5' },
  { _id: '2', nameKey: 'category.dairy', icon: '🥛', slug: 'dairy-bread-eggs', bgColor: '#E8F5E9' },
  { _id: '3', nameKey: 'category.fruits', icon: '🥦', slug: 'fruits-vegetables', bgColor: '#E8F5E9' },
  { _id: '4', nameKey: 'category.drinks', icon: '🧃', slug: 'cold-drinks-juices', bgColor: '#FFF3E0' },
  { _id: '5', nameKey: 'category.snacks', icon: '🍿', slug: 'snacks-munchies', bgColor: '#FFF8E1' },
  { _id: '6', nameKey: 'category.breakfast', icon: '🥣', slug: 'breakfast-instant-food', bgColor: '#FFF3E0' },
  { _id: '7', nameKey: 'category.sweet', icon: '🍫', slug: 'sweet-tooth', bgColor: '#FCE4EC' },
  { _id: '8', nameKey: 'category.bakery', icon: '🍪', slug: 'bakery-biscuits', bgColor: '#FFF8E1' },
  { _id: '9', nameKey: 'category.tea', icon: '☕', slug: 'tea-coffee-health-drink', bgColor: '#EFEBE9' },
  { _id: '10', nameKey: 'category.atta', icon: '🌾', slug: 'atta-rice-dal', bgColor: '#FFF8E1' },
  { _id: '11', nameKey: 'category.baby', icon: '👶', slug: 'baby-care', bgColor: '#E3F2FD' },
  { _id: '12', nameKey: 'category.pharma', icon: '💊', slug: 'pharma-wellness', bgColor: '#E8F5E9' },
  { _id: '13', nameKey: 'category.cleaning', icon: '🧹', slug: 'cleaning-essentials', bgColor: '#E3F2FD' },
  { _id: '14', nameKey: 'category.personal', icon: '🧴', slug: 'personal-care', bgColor: '#F3E5F5' },
  { _id: '15', nameKey: 'category.home', icon: '🏠', slug: 'home-office', bgColor: '#ECEFF1' },
  { _id: '16', nameKey: 'category.pet', icon: '🐕', slug: 'pet-care', bgColor: '#FFF3E0' },
]

export default function CategoryGrid() {
  const [categories, setCategories] = useState([])
  const { t } = useTranslation()

  useEffect(() => {
    getCategories()
      .then((res) => {
        if (res.data?.length) {
          setCategories(
            res.data.map((cat) => ({
              ...cat,
              nameKey: null,
            }))
          )
        }
      })
      .catch(() => {})
  }, [])

  const resolvedCategories = categories.length > 0 ? categories : FALLBACK_CATEGORIES.map((cat) => ({
    ...cat,
    name: t(cat.nameKey),
  }))

  return (
    <section className="category-grid max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="category-grid__header flex items-center justify-between mb-5">
        <h2 className="category-grid__title text-lg sm:text-xl font-extrabold text-text-primary tracking-tight">
          {t('category.title')}
        </h2>
        <a href="/categories" className="category-grid__see-all text-brand-green text-sm font-semibold hover:underline">
          {t('category.seeAll')}
        </a>
      </div>

      <div className="category-grid__list grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 overflow-hidden">
        {resolvedCategories.map((cat) => (
          <CategoryCard key={cat._id} category={cat} />
        ))}
      </div>
    </section>
  )
}
