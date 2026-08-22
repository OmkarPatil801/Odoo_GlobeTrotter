import api from './api'

export const searchCities = (query) => api.get('/cities/search', { params: { q: query } })

export const getCityById = (cityId) => api.get(`/cities/${cityId}`)

export const getPopularCities = () => api.get('/cities')
