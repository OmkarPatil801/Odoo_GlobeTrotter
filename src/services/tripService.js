import api from './api'

export const getTrips = () => api.get('/trips')

export const getTripById = (tripId) => api.get(`/trips/${tripId}`)

export const createTrip = (tripData) => api.post('/trips', tripData)

export const updateTrip = (tripId, tripData) => api.put(`/trips/${tripId}`, tripData)

export const deleteTrip = (tripId) => api.delete(`/trips/${tripId}`)
