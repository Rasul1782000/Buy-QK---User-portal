import './CategoryCard.css'

export default function CategoryCard({ category }) {
  return (
    <a
      href={`/category/${category.slug}`}
      className="category-card group flex flex-col items-center gap-2 p-3 rounded-xl border border-transparent hover:border-brand-green hover:shadow-md bg-surface-white transition-all duration-200 cursor-pointer"
    >
      <div
        className="category-card__icon flex items-center justify-center"
        style={{ backgroundColor: category.bgColor || '#F8F8F8' }}
      >
        {category.icon}
      </div>
      <span className="category-card__name truncate">
        {category.name}
      </span>
    </a>
  )
}
