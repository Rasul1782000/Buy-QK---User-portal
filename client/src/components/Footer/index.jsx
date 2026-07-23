import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer bg-midnight mt-8">
      <div className="footer__container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="footer__content grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="footer__brand">
            <div className="flex items-center gap-1 mb-4">
              <div className="w-8 h-8 rounded-lg bg-logo-green flex items-center justify-center">
                <span className="text-brand-yellow font-black text-xs">QK</span>
              </div>
              <div className="flex items-baseline">
                <span className="text-brand-green font-extrabold text-lg">Buy</span>
                <span className="text-white font-extrabold text-lg">QK</span>
              </div>
            </div>
            <p className="footer__description text-text-muted text-sm leading-relaxed max-w-xs">
              Every Local Need. One Intelligent Marketplace. Connecting customers, local businesses, and delivery partners for Indian neighborhoods.
            </p>
          </div>

          <div className="footer__links grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Company</h4>
              <ul className="space-y-2">
                {['About Us', 'Careers', 'Blog', 'Press'].map((item) => (
                  <li key={item}>
                    <a href="#" className="footer__link text-text-muted text-sm hover:text-brand-green transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Support</h4>
              <ul className="space-y-2">
                {['Help Center', 'Partner with us', 'Terms', 'Privacy'].map((item) => (
                  <li key={item}>
                    <a href="#" className="footer__link text-text-muted text-sm hover:text-brand-green transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="footer__download">
            <h4 className="text-white font-semibold text-sm mb-3">Download the app</h4>
            <div className="flex flex-col gap-3">
              <a href="#" className="block w-40">
                <img src="/app-store.svg" alt="Download on App Store" className="w-full" />
              </a>
              <a href="#" className="block w-40">
                <img src="/play-store.svg" alt="Get it on Google Play" className="w-full" />
              </a>
            </div>
          </div>
        </div>

        <div className="footer__bottom border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="footer__copyright text-text-muted text-xs">
            &copy; 2026 BuyQK. All rights reserved.
          </p>
          <p className="footer__tagline text-text-muted text-xs">
            Made for busy city shoppers across India.
          </p>
        </div>
      </div>
    </footer>
  )
}
