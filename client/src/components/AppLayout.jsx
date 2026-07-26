import Header from './Header'
import PromoBanner from './PromoBanner'
import CategoryGrid from './CategoryGrid'
import Footer from './Footer'
import { useTranslation } from '../translations'

export default function AppLayout() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-surface-white">
      <Header />

      <main>
        <PromoBanner />

        <CategoryGrid />

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-brand-green to-brand-green-light rounded-xl p-6 text-white">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-bold text-lg mb-1">{t('home.feature1Title')}</h3>
              <p className="text-sm opacity-80">{t('home.feature1Desc')}</p>
            </div>
            <div className="bg-gradient-to-br from-brand-yellow to-[#f0b830] rounded-xl p-6 text-midnight">
              <div className="text-3xl mb-2">💰</div>
              <h3 className="font-bold text-lg mb-1">{t('home.feature2Title')}</h3>
              <p className="text-sm opacity-80">{t('home.feature2Desc')}</p>
            </div>
            <div className="bg-gradient-to-br from-promo-red to-[#d43838] rounded-xl p-6 text-white">
              <div className="text-3xl mb-2">🏪</div>
              <h3 className="font-bold text-lg mb-1">{t('home.feature3Title')}</h3>
              <p className="text-sm opacity-80">{t('home.feature3Desc')}</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
