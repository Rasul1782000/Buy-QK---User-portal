import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signup } from '../api/client'
import { useAuth } from '../context/useAuth'
import { useTranslation } from '../translations'
import './LoginPage.css'

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

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { saveAuth } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!name || !email || !password) {
      setError(t('signup.error.empty'))
      return
    }

    if (password !== confirmPassword) {
      setError(t('signup.error.mismatch'))
      return
    }

    if (password.length < 8) {
      setError(t('signup.error.length'))
      return
    }

    if (!agreeTerms) {
      setError(t('signup.error.terms'))
      return
    }

    setSubmitting(true)
    try {
      const res = await signup({ name, email, password })
      saveAuth(res.data.user)
      navigate('/home')
    } catch (err) {
      setError(err.response?.data?.message || t('signup.error.failed'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login">
      <div className="login__container">
        <div className="login__card login__card--compact login__card--animate">
          <div className="login__header">
            <h1 className="login__title">{t('signup.title')}</h1>
            <p className="login__subtitle">{t('signup.subtitle')}</p>
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
              <label className="login__label" htmlFor="name">{t('signup.nameLabel')}</label>
              <input
                className="login__input"
                id="name"
                type="text"
                placeholder={t('signup.namePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                autoFocus
              />
            </div>

            <div className="login__field">
              <label className="login__label" htmlFor="email">{t('signup.emailLabel')}</label>
              <input
                className="login__input"
                id="email"
                type="email"
                placeholder={t('common.enterEmail')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="login__field">
              <label className="login__label" htmlFor="password">{t('signup.passwordLabel')}</label>
              <div className="login__input-wrap">
                <input
                  className="login__input"
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('common.enterPassword')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
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
              <label className="login__label" htmlFor="confirmPassword">{t('signup.confirmLabel')}</label>
              <div className="login__input-wrap">
                <input
                  className="login__input"
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder={t('common.reenterPassword')}
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

            <label className="login__remember">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <span>{t('signup.terms')}</span>
            </label>

            <button type="submit" className="login__btn" disabled={submitting}>
              {submitting ? t('signup.btnLoading') : t('signup.btn')}
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
            {t('signup.footer')} <a href="/login">{t('signup.footerLink')}</a>
          </p>
        </div>
      </div>
    </div>
  )
}
