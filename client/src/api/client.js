import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

const AUTH_URLS = [
  '/auth/login',
  '/auth/signup',
  '/auth/send-otp',
  '/auth/verify-otp',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/logout',
]

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const url = error.config?.url || ''

    if (status === 401 && !AUTH_URLS.some((path) => url.includes(path))) {
      localStorage.removeItem('buyqk_user')
      window.dispatchEvent(new CustomEvent('auth:unauthorized'))
    }
    return Promise.reject(error)
  }
)

export const signup = (data) => api.post('/auth/signup', data)
export const login = (data) => api.post('/auth/login', data)
export const demoLogin = (data) => api.post('/auth/demo-login', data)
export const forgotPassword = (data) => api.post('/auth/forgot-password', data)
export const resetPassword = (data) => api.post('/auth/reset-password', data)
export const getMe = () => api.get('/auth/me')
export const logout = () => api.post('/auth/logout')
export const sendOTP = (data) => api.post('/auth/send-otp', data)
export const verifyOTP = (data) => api.post('/auth/verify-otp', data)

export const getCategories = () => api.get('/categories')
export const getBanners = () => api.get('/banners')
export const getPopularSearches = () => api.get('/search/popular')

export default api
