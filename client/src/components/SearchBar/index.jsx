import { useState, useEffect } from 'react'
import { getPopularSearches } from '../../api/client'
import { useTranslation } from '../../translations'
import './SearchBar.css'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [popularSearches, setPopularSearches] = useState([])
  const { t } = useTranslation()

  useEffect(() => {
    setPopularSearches(['Milk', 'Bread', 'Sugar', 'Butter', 'Paneer', 'Chocolate'])
    getPopularSearches()
      .then((res) => {
        if (res.data?.length) {
          setPopularSearches(res.data.map((s) => s.term || s))
        }
      })
      .catch(() => {})
  }, [])

  return (
    <div className="search-bar flex flex-col gap-2.5">
      <div className="search-bar__input-wrapper relative">
        <svg className="search-bar__icon absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('search.placeholder')}
          className="search-bar__input w-full h-12 pl-11 pr-4 bg-surface-white border-2 border-border-gray rounded-lg text-sm text-text-body placeholder:text-text-muted focus:outline-none focus:border-brand-green transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="search-bar__clear absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="search-bar__popular flex items-center gap-2 flex-wrap">
        <span className="search-bar__popular-label text-[11px] font-semibold text-text-muted uppercase tracking-wider">{t('search.popular')}</span>
        {popularSearches.map((term) => (
          <button
            key={term}
            onClick={() => setQuery(term)}
            className="search-bar__tag px-3 py-1 bg-surface-gray border border-border-gray rounded-full text-xs font-medium text-text-body hover:bg-brand-green hover:text-white hover:border-brand-green transition-all duration-200"
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  )
}
