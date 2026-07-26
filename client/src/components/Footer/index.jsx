import { useTranslation } from '../../translations'
import './Footer.css'

export default function Footer() {
  const { t } = useTranslation()

  const companyLinks = [
    { label: t('footer.aboutUs'), href: '#' },
    { label: t('footer.careers'), href: '#' },
    { label: t('footer.blog'), href: '#' },
    { label: t('footer.press'), href: '#' },
  ]

  const supportLinks = [
    { label: t('footer.helpCenter'), href: '#' },
    { label: t('footer.partner'), href: '#' },
    { label: t('footer.terms'), href: '#' },
    { label: t('footer.privacy'), href: '#' },
  ]

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
              {t('footer.description')}
            </p>
          </div>

          <div className="footer__links grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">{t('footer.company')}</h4>
              <ul className="space-y-2">
                {companyLinks.map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="footer__link text-text-muted text-sm hover:text-brand-green transition-colors">{item.label}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">{t('footer.support')}</h4>
              <ul className="space-y-2">
                {supportLinks.map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="footer__link text-text-muted text-sm hover:text-brand-green transition-colors">{item.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="footer__download">
            <h4 className="text-white font-semibold text-sm mb-3">{t('footer.download')}</h4>
            <div className="flex flex-col gap-3">
              <a href="#" className="block w-40">
                <img src="/app-store.svg" alt={t('footer.appStoreAlt')} className="w-full" />
              </a>
              <a href="#" className="block w-40">
                <img src="/play-store.svg" alt={t('footer.googlePlayAlt')} className="w-full" />
              </a>
            </div>
          </div>
        </div>

        <div className="footer__bottom border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="footer__copyright text-text-muted text-xs">
            {t('footer.copyright')}
          </p>
          <p className="footer__tagline text-text-muted text-xs">
            {t('footer.tagline')}
          </p>
        </div>
      </div>
    </footer>
  )
}
