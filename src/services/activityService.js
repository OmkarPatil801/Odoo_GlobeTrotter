import api from './api'

export const searchActivities = (query, cityId) =>
  api.get('/activities/search', { params: { q: query, cityId } })

export const getActivityById = (activityId) => api.get(`/activities/${activityId}`)

export const getActivitiesByCity = (cityId) => api.get(`/cities/${cityId}/activities`)
