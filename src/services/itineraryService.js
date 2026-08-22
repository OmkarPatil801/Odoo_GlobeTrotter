import api from './api'

export const getItinerary = (tripId) => api.get(`/trips/${tripId}/itinerary`)

export const updateItinerary = (tripId, itineraryData) =>
  api.put(`/trips/${tripId}/itinerary`, itineraryData)

export const addStop = (tripId, stopData) => api.post(`/trips/${tripId}/stops`, stopData)

export const removeStop = (tripId, stopId) => api.delete(`/trips/${tripId}/stops/${stopId}`)

export const addActivityToItinerary = (tripId, stopId, activityData) =>
  api.post(`/trips/${tripId}/stops/${stopId}/activities`, activityData)

export const removeActivityFromItinerary = (tripId, stopId, activityId) =>
  api.delete(`/trips/${tripId}/stops/${stopId}/activities/${activityId}`)
