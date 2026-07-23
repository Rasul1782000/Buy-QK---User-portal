import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const getCategories = () => api.get('/categories')
export const getBanners = () => api.get('/banners')
export const getPopularSearches = () => api.get('/search/popular')

export default api
