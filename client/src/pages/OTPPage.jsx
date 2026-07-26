import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { verifyOTP } from '../api/client'
import { useTranslation } from '../translations'
import { useLanguage } from '../context/LanguageContext'
import './OTPPage.css'

export default function OTPPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [resending, setResending] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const inputRefs = useRef([])
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  const { language, setLanguage, getLabel, LANGUAGES } = useLanguage()

  const phone = location.state?.phone || ''
  const email = location.state?.email || ''
  const identifier = phone || email

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleChange = (index, value) => {
    if (value.length > 1) value = value.slice(0, 1)
    if (value && !/^\d$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError('')
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      setOtp(pasted.split(''))
      inputRefs.current[5]?.focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const otpValue = otp.join('')
    if (otpValue.length !== 6) {
      setError(t('otp.incomplete'))
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const res = await verifyOTP({ phone, email, otp: otpValue })
      if (res.data?.token) {
        localStorage.setItem('buyqk_token', res.data.token)
        if (res.data.user) {
          localStorage.setItem('buyqk_user', JSON.stringify(res.data.user))
        }
        navigate('/home')
      } else {
        setError(t('otp.invalid'))
      }
    } catch (err) {
      setError(err.response?.data?.message || t('otp.invalid'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleResend = async () => {
    if (countdown > 0) return
    setResending(true)
    try {
      await verifyOTP({ phone, email, otp: 'resend' })
      setCountdown(60)
    } catch {
      setError(t('otp.resendFailed'))
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="otp">
      <div className="otp__container">
        <div className="otp__card otp__card--animate">
          <div className="otp__lang-selector">
            <button
              type="button"
              className="otp__lang-btn"
              onClick={() => {}}
            >
              {getLabel(language)}
            </button>
          </div>

          <div className="otp__header">
            <div className="otp__logo">
              <span className="otp__logo-text">BuyQK</span>
            </div>
            <h1 className="otp__title">{t('otp.title')}</h1>
            <p className="otp__subtitle">
              {t('otp.subtitle')} <strong>{identifier}</strong>
            </p>
          </div>

          {error && (
            <div className="otp__alert otp__alert--error">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} width="16" height="16">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form className="otp__form" onSubmit={handleSubmit}>
            <div className="otp__inputs" onPaste={handlePaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="otp__input"
                  autoComplete="one-time-code"
                />
              ))}
            </div>

            <button type="submit" className="otp__btn" disabled={submitting || otp.some(d => !d)}>
              {submitting ? t('otp.verifying') : t('otp.verify')}
            </button>
          </form>

          <div className="otp__footer">
            <button
              type="button"
              className="otp__resend"
              onClick={handleResend}
              disabled={countdown > 0 || resending}
            >
              {resending
                ? t('otp.sending')
                : countdown > 0
                  ? `${t('otp.resendIn')} ${countdown}s`
                  : t('otp.resend')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}