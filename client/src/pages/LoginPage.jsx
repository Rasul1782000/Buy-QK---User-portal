import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/client'
import { useAuth } from '../context/useAuth'
import logoImg from '../assets/logos.png'
import { useLanguage } from '../context/LanguageContext'
import { useTranslation } from '../translations'
import './LoginPage.css'

function GlobeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="login__lang-icon">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="login__lang-arrow">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="login__input-icon-left">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="login__social-icon-embed">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="login__social-icon-embed" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showLanguages, setShowLanguages] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const { saveAuth } = useAuth()
  const { language, setLanguage, getLabel, LANGUAGES } = useLanguage()
  const { t } = useTranslation()

  useEffect(() => {
    const saved = localStorage.getItem('buyqk_saved_identifier')
    if (saved) {
      setIdentifier(saved)
      setRememberMe(true)
    }
  }, [])

  const isEmail = identifier.includes('@')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!identifier) {
      setError(t('login.error.empty'))
      return
    }
    if (!password) {
      setError(t('login.error.empty'))
      return
    }

    setSubmitting(true)
    try {
      const payload = isEmail ? { email: identifier, password } : { phone: identifier, password }
      const res = await login(payload)
      if (res.data?.otpRequired) {
        if (rememberMe) {
          localStorage.setItem('buyqk_saved_identifier', identifier)
        } else {
          localStorage.removeItem('buyqk_saved_identifier')
        }
        sessionStorage.setItem('buyqk_pending_identifier', identifier)
        navigate('/otp', { state: { identifier, isPhoneLogin: !isEmail, devOtp: res.data.devOtp } })
      } else {
        navigate('/home')
      }
    } catch (err) {
      setError(err.response?.data?.message || t('login.error.invalid'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login">
      <div className="login__container">
        <div className="login__card login__card--animate">
          <div className="login__lang-selector">
            <button
              type="button"
              className="login__lang-btn"
              onClick={() => setShowLanguages(!showLanguages)}
            >
              <GlobeIcon />
              <span>{getLabel(language)}</span>
              <ChevronDownIcon />
            </button>
            {showLanguages && (
              <div className="login__lang-dropdown">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    className="login__lang-option"
                    onClick={() => {
                      setLanguage(lang.code)
                      setShowLanguages(false)
                    }}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="login__header">
            <div className="login__logo">
              <img src={logoImg} alt="BuyQK" className="login__logo-img" />
            </div>
            <h1 className="login__title">
              {t('login.title')}
            </h1>
            <p className="login__subtitle">
              {t('login.subtitle')}
            </p>
          </div>

          {error && (
            <div className="login__alert login__alert--error">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} width="16" height="16">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form className="login__form" onSubmit={handleSubmit}>
            <div className="login__field">
              <div className="login__field-header">
                <label className="login__label" htmlFor="identifier">{t('login.emailLabel')} / {t('login.phoneLabel')}</label>
              </div>
              <div className="login__input-wrap">
                <input
                  className="login__input login__input--no-icon"
                  id="identifier"
                  type="text"
                  inputMode="email"
                  placeholder={t('login.identifierPlaceholder')}
                  autoComplete="email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <div className="login__field">
              <div className="login__field-header">
                <label className="login__label" htmlFor="password">{t('common.password')}</label>
                <a className="login__forgot" href="/forgot-password">{t('login.forgotPassword')}</a>
              </div>
              <div className="login__input-wrap">
                <LockIcon />
                <input
                  className="login__input"
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('common.enterPassword')}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="login__eye"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <label className="login__remember">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>{t('login.rememberMe')}</span>
            </label>

            <button type="submit" className="login__btn" disabled={submitting}>
              {submitting ? t('login.btnLoading') : t('login.btn')}
            </button>
          </form>

          <div className="login__divider">
            <span />
            <span>{t('common.or')}</span>
            <span />
          </div>

          <div className="login__social">
            <button type="button" className="login__social-btn-full" disabled title={t('common.comingSoon')}>
              <GoogleIcon />
              <span>{t('common.continueGoogle')}</span>
            </button>
            <button type="button" className="login__social-btn-full" disabled title={t('common.comingSoon')}>
              <FacebookIcon />
              <span>{t('common.continueFacebook')}</span>
            </button>
          </div>

          <p className="login__footer">
            {t('login.footer')}
            <a href="/signup">{t('login.footerLink')}</a>
          </p>
        </div>
      </div>
    </div>
  )
}
