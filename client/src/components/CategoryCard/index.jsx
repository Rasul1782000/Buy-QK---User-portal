import './CategoryCard.css'

export default function CategoryCard({ category }) {
  return (
    <a
      href={`/category/${category.slug}`}
      className="category-card group flex flex-col items-center gap-2.5 p-4 rounded-xl border border-transparent hover:border-brand-green hover:shadow-md bg-surface-white transition-all duration-200 cursor-pointer"
    >
      <div
        className="category-card__icon w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl transition-transform duration-200 group-hover:scale-110"
        style={{ backgroundColor: category.bgColor || '#F8F8F8' }}
      >
        {category.icon}
      </div>
      <span className="category-card__name text-xs sm:text-sm font-semibold text-text-primary text-center leading-tight">
        {category.name}
      </span>
    </a>
  )
}
