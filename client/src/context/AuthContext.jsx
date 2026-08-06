import { createContext, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMe, logout as logoutRequest } from '../api/client'

const AuthContext = createContext(null)

const PUBLIC_PATHS = ['/login', '/signup', '/otp', '/forgot-password']

function readCachedUser() {
  try {
    return JSON.parse(localStorage.getItem('buyqk_user') || 'null')
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readCachedUser)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem('buyqk_user')
    setUser(null)
    if (!PUBLIC_PATHS.includes(window.location.pathname)) {
      navigate('/login', { replace: true })
    }
  }, [navigate])

  useEffect(() => {
    window.addEventListener('auth:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized)
  }, [handleUnauthorized])

  useEffect(() => {
    let cancelled = false
    getMe()
      .then((res) => {
        if (cancelled) return
        localStorage.setItem('buyqk_user', JSON.stringify(res.data.user))
        setUser(res.data.user)
      })
      .catch(() => {
        if (cancelled) return
        localStorage.removeItem('buyqk_user')
        setUser(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const saveAuth = (user) => {
    localStorage.setItem('buyqk_user', JSON.stringify(user))
    setUser(user)
  }

  const logout = async () => {
    try {
      await logoutRequest()
    } catch {
      // ignore — session is cleared client-side regardless
    }
    localStorage.removeItem('buyqk_user')
    setUser(null)
    navigate('/login', { replace: true })
  }

  return (
    <AuthContext.Provider value={{ user, loading, saveAuth, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
