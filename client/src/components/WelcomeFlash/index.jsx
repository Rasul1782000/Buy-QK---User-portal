import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '../../translations'
import logoImg from '../../assets/logos.png'
import './WelcomeFlash.css'

export default function WelcomeFlash() {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(t1)
  }, [])

  useEffect(() => {
    const t2 = setTimeout(() => setFadeOut(true), 1600)
    return () => clearTimeout(t2)
  }, [])

  useEffect(() => {
    if (fadeOut) {
      const t3 = setTimeout(() => navigate('/login', { replace: true }), 400)
      return () => clearTimeout(t3)
    }
  }, [fadeOut, navigate])

  return (
    <div className={`welcome-flash ${fadeOut ? 'welcome-flash--exit' : ''}`}>
      <div className="welcome-flash__bg-circle welcome-flash__bg-circle--1" />
      <div className="welcome-flash__bg-circle welcome-flash__bg-circle--2" />

      <div className={`welcome-flash__content ${visible ? 'welcome-flash__content--show' : ''}`}>
        <img
          src={logoImg}
          alt={t('welcome.brand')}
          className="welcome-flash__logo"
        />
        <h1 className="welcome-flash__brand">
          {t('welcome.brand')}
        </h1>
        <p className="welcome-flash__subtitle">
          {t('welcome.subtitle')}
        </p>
      </div>
    </div>
  )
}
