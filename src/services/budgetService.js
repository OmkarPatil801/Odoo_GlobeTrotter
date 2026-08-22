import api from './api'

export const getBudget = (tripId) => api.get(`/trips/${tripId}/budget`)

export const updateBudget = (tripId, budgetData) => api.put(`/trips/${tripId}/budget`, budgetData)

export const getCostBreakdown = (tripId) => api.get(`/trips/${tripId}/budget/breakdown`)
