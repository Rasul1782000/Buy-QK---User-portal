import { useState } from 'react'
import { forgotPassword, resetPassword } from '../api/client'
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

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showLanguages, setShowLanguages] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { language, setLanguage, getLabel, LANGUAGES } = useLanguage()
  const { t } = useTranslation()

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!email) {
      setError(t('forgot.error.emptyEmail'))
      return
    }

    setSubmitting(true)
    try {
      const res = await forgotPassword({ email })
      setMessage(res.data.message)
      if (res.data.resetToken) {
        setResetToken(res.data.resetToken)
        setStep(2)
      }
    } catch (err) {
      setError(err.response?.data?.message || t('forgot.error.failed'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleResetSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!newPassword || !confirmPassword) {
      setError(t('forgot.error.emptyPasswords'))
      return
    }

    if (newPassword !== confirmPassword) {
      setError(t('forgot.error.mismatch'))
      return
    }

    if (newPassword.length < 6) {
      setError(t('forgot.error.length'))
      return
    }

    setSubmitting(true)
    try {
      const res = await resetPassword({ token: resetToken, password: newPassword })
      setMessage(res.data.message + t('forgot.redirect'))
      setTimeout(() => {
        window.location.href = '/login'
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || t('forgot.error.failed'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login">
      <div className="login__container">
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

        <div className="login__card login__card--compact login__card--animate">
          <div className="login__header">
            <h1 className="login__title">
              {step === 1 ? t('forgot.title1') : t('forgot.title2')}
            </h1>
            <p className="login__subtitle">
              {step === 1 ? t('forgot.subtitle1') : t('forgot.subtitle2')}
            </p>
          </div>

          {message && (
            <div className="login__alert login__alert--success">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} width="16" height="16">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{message}</span>
            </div>
          )}
          {error && (
            <div className="login__alert login__alert--error">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} width="16" height="16">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {step === 1 ? (
            <form className="login__form" onSubmit={handleEmailSubmit}>
              <div className="login__field">
                <label className="login__label" htmlFor="email">{t('forgot.emailLabel')}</label>
                <input
                  className="login__input"
                  id="email"
                  type="email"
                  placeholder={t('forgot.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  autoFocus
                />
              </div>

              <button type="submit" className="login__btn" disabled={submitting}>
                {submitting ? t('forgot.btn1Loading') : t('forgot.btn1')}
              </button>
            </form>
          ) : (
            <form className="login__form" onSubmit={handleResetSubmit}>
              <div className="login__field">
                <label className="login__label" htmlFor="newPassword">{t('forgot.newPasswordLabel')}</label>
                <div className="login__input-wrap">
                  <input
                    className="login__input"
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('forgot.newPasswordPlaceholder')}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                    autoFocus
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

              <div className="login__field">
                <label className="login__label" htmlFor="confirmPassword">{t('forgot.confirmLabel')}</label>
                <div className="login__input-wrap">
                  <input
                    className="login__input"
                    id="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder={t('forgot.confirmPlaceholder')}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="login__eye"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <button type="submit" className="login__btn" disabled={submitting}>
                {submitting ? t('forgot.btn2Loading') : t('forgot.btn2')}
              </button>
            </form>
          )}

          <p className="login__footer">
            <a href="/login">{t('forgot.footer')}</a>
          </p>
        </div>
      </div>
    </div>
  )
}
