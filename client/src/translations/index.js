import { useLanguage } from '../context/LanguageContext'
import en from './en'
import ta from './ta'
import hi from './hi'
import bn from './bn'
import kn from './kn'

const translations = { en, ta, hi, bn, kn }

export function useTranslation() {
  const { language } = useLanguage()

  const t = (key) => {
    const langStrings = translations[language] || translations.en
    return langStrings[key] || translations.en[key] || key
  }

  return { t, language }
}

export default translations
