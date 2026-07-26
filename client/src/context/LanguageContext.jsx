import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
]

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('buyqk_lang') || 'en'
  })

  const setLanguage = (lang) => {
    setLanguageState(lang)
    localStorage.setItem('buyqk_lang', lang)
  }

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const getLabel = (code) => {
    const found = LANGUAGES.find((l) => l.code === code)
    return found ? found.label : code
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, getLabel, LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
