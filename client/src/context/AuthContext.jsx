import { createContext, useState, useEffect } from 'react'
import { getMe } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('buyqk_token')
    if (!token) {
      setLoading(false)
      return
    }
    getMe()
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem('buyqk_token'))
      .finally(() => setLoading(false))
  }, [])

  const saveAuth = (token, userData) => {
    localStorage.setItem('buyqk_token', token)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('buyqk_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, saveAuth, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
