import { useState, useEffect, useCallback } from 'react'
import { getBanners } from '../../api/client'
import './PromoBanner.css'

const fallbackBanners = [
  {
    _id: '1',
    title: 'Flat 20% OFF',
    subtitle: 'On all grocery essentials. Use code BUYQK20',
    ctaText: 'Shop Now',
    bgColor: '#0C831F',
    textColor: '#FFFFFF',
  },
  {
    _id: '2',
    title: 'Fresh Fruits & Veggies',
    subtitle: 'Farm fresh produce delivered in 10 minutes',
    ctaText: 'Order Now',
    bgColor: '#51AA1B',
    textColor: '#FFFFFF',
  },
  {
    _id: '3',
    title: 'Daily Dairy Deals',
    subtitle: 'Milk, Curd, Paneer & more at lowest prices',
    ctaText: 'Explore',
    bgColor: '#F8CB46',
    textColor: '#1A1A2E',
  },
]

export default function PromoBanner() {
  const [banners, setBanners] = useState(fallbackBanners)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    getBanners()
      .then((res) => {
        if (res.data?.length) setBanners(res.data)
      })
      .catch(() => {})
  }, [])

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % banners.length)
  }, [banners.length])

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length)
  }, [banners.length])

  useEffect(() => {
    const timer = setInterval(next, 4000)
    return () => clearInterval(timer)
  }, [next])

  const banner = banners[current]

  return (
    <div className="promo-banner max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div
        className="promo-banner__slide relative w-full rounded-xl overflow-hidden"
        style={{ backgroundColor: banner.bgColor || '#0C831F' }}
      >
        <div className="promo-banner__content flex items-center justify-between px-6 sm:px-10 py-8 sm:py-12">
          <div className="promo-banner__text flex-1">
            <h2
              className="promo-banner__title text-2xl sm:text-4xl font-extrabold mb-2 tracking-tight"
              style={{ color: banner.textColor || '#FFFFFF' }}
            >
              {banner.title}
            </h2>
            <p
              className="promo-banner__subtitle text-sm sm:text-base font-medium mb-5 max-w-lg opacity-90"
              style={{ color: banner.textColor || '#FFFFFF' }}
            >
              {banner.subtitle}
            </p>
            <button
              className="promo-banner__cta bg-white font-bold text-sm px-6 py-2.5 rounded transition-all hover:shadow-lg"
              style={{ color: banner.bgColor || '#0C831F' }}
            >
              {banner.ctaText}
            </button>
          </div>

          <div className="promo-banner__visual hidden md:flex items-center gap-3 ml-6">
            <div className="w-28 h-28 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-5xl">
                {current === 0 ? '🛒' : current === 1 ? '🥦' : '🥛'}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={prev}
          className="promo-banner__nav promo-banner__nav--prev absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={next}
          className="promo-banner__nav promo-banner__nav--next absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div className="promo-banner__dots absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`promo-banner__dot w-2 h-2 rounded-full transition-all duration-300 ${
                i === current ? 'bg-white w-5' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
