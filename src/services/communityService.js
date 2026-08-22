import api from './api'

export const getPublicItineraries = () => api.get('/community/itineraries')

export const getPublicItineraryById = (itineraryId) =>
  api.get(`/community/itineraries/${itineraryId}`)

export const shareItinerary = (tripId) => api.post(`/trips/${tripId}/share`)

export const unshareItinerary = (tripId) => api.delete(`/trips/${tripId}/share`)

export const likeItinerary = (itineraryId) => api.post(`/community/itineraries/${itineraryId}/like`)
