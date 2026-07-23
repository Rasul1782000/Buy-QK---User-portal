import SearchBar from '../SearchBar'
import LocationDetector from '../LocationDetector'
import './Header.css'

export default function Header() {
  return (
    <header className="header sticky top-0 z-50">
      <div className="header__top bg-midnight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="header__logo flex items-center gap-1 shrink-0">
              <div className="w-9 h-9 rounded-lg bg-logo-green flex items-center justify-center">
                <span className="text-brand-yellow font-black text-sm">QK</span>
              </div>
              <div className="flex items-baseline">
                <span className="text-brand-green font-extrabold text-xl tracking-tight">Buy</span>
                <span className="text-white font-extrabold text-xl tracking-tight">QK</span>
              </div>
            </a>

            <LocationDetector />

            <div className="header__actions flex items-center gap-4">
              <button className="header__login hidden sm:flex items-center gap-2 text-white text-sm font-medium hover:text-brand-yellow transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Login
              </button>
              <button className="header__cart relative flex items-center gap-2 bg-brand-green hover:bg-brand-green-light text-white text-sm font-semibold px-4 py-2 rounded transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                <span className="hidden sm:inline">My Cart</span>
                <span className="header__cart-badge absolute -top-1.5 -right-1.5 bg-promo-red text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">0</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="header__search bg-surface-white border-b border-border-gray shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <SearchBar />
        </div>
      </div>
    </header>
  )
}
