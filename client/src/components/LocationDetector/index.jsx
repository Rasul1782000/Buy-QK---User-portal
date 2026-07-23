import { useState } from 'react'
import './LocationDetector.css'

export default function LocationDetector() {
  const [location, setLocation] = useState('Detecting location...')
  const [loading, setLoading] = useState(false)

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocation('Geolocation not supported')
      return
    }
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(`${position.coords.latitude.toFixed(2)}°N, ${position.coords.longitude.toFixed(2)}°E`)
        setLoading(false)
      },
      () => {
        setLocation('Koramangala, Bengaluru')
        setLoading(false)
      },
      { timeout: 5000 }
    )
  }

  return (
    <div className="location-detector hidden md:flex items-center gap-2 text-white">
      <svg className="location-detector__icon w-4 h-4 text-brand-green shrink-0" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
      <div className="location-detector__info flex flex-col">
        <span className="location-detector__label text-[11px] text-text-muted leading-none">Delivery in 10 minutes</span>
        <div className="location-detector__value flex items-center gap-1">
          <span className="location-detector__address text-sm font-semibold truncate max-w-[180px]">{location}</span>
          <button
            onClick={detectLocation}
            disabled={loading}
            className="location-detector__detect text-brand-green text-xs font-semibold hover:underline whitespace-nowrap"
          >
            {loading ? 'Detecting...' : 'Detect my location'}
          </button>
        </div>
      </div>
    </div>
  )
}
