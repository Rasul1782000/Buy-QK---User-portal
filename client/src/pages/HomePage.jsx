import Header from '../components/Header'
import PromoBanner from '../components/PromoBanner'
import CategoryGrid from '../components/CategoryGrid'
import Footer from '../components/Footer'

export default function HomePage() {
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
              <h3 className="font-bold text-lg mb-1">Lightning Fast Delivery</h3>
              <p className="text-sm opacity-80">Get your groceries delivered in 10 minutes, guaranteed.</p>
            </div>
            <div className="bg-gradient-to-br from-brand-yellow to-[#f0b830] rounded-xl p-6 text-midnight">
              <div className="text-3xl mb-2">💰</div>
              <h3 className="font-bold text-lg mb-1">Best Prices Daily</h3>
              <p className="text-sm opacity-80">Compare prices from local stores. Always the lowest.</p>
            </div>
            <div className="bg-gradient-to-br from-promo-red to-[#d43838] rounded-xl p-6 text-white">
              <div className="text-3xl mb-2">🏪</div>
              <h3 className="font-bold text-lg mb-1">10,000+ Local Stores</h3>
              <p className="text-sm opacity-80">Your neighborhood shops, all in one place.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
