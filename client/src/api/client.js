import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('buyqk_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const signup = (data) => api.post('/auth/signup', data)
export const login = (data) => api.post('/auth/login', data)
export const forgotPassword = (data) => api.post('/auth/forgot-password', data)
export const resetPassword = (data) => api.post('/auth/reset-password', data)
export const getMe = () => api.get('/auth/me')
export const sendOTP = (data) => api.post('/auth/send-otp', data)
export const verifyOTP = (data) => api.post('/auth/verify-otp', data)

export const getCategories = () => api.get('/categories')
export const getBanners = () => api.get('/banners')
export const getPopularSearches = () => api.get('/search/popular')

export default api
