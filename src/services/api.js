import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL,
  // Keep the offline demo fallback snappy when no backend is running.
  timeout: 4000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// When the API isn't running (demo/offline mode) every call fails the same
// way. Remember that for a short window and short-circuit further requests so
// the app falls straight through to its local demo data instead of spraying
// connection errors at the console on every navigation.
// With VITE_DEMO_MODE=true the app never contacts the API at all — every
// screen serves its bundled demo data. Useful for offline demos/recordings.
const DEMO_MODE = String(import.meta.env.VITE_DEMO_MODE).toLowerCase() === 'true'

const OFFLINE_TTL = 30_000
let offlineUntil = DEMO_MODE ? Infinity : 0

export function isApiOffline() {
  return DEMO_MODE || Date.now() < offlineUntil
}

function offlineError(config) {
  const error = new Error('API unreachable — using offline demo data.')
  error.config = config
  error.code = 'ERR_NETWORK'
  error.isOfflineShortCircuit = true
  return error
}

// Attach auth token (if present) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (isApiOffline()) {
    return Promise.reject(offlineError(config))
  }
  return config
})

// Central place to react to auth failures once the backend is wired up.
api.interceptors.response.use(
  (response) => {
    if (!DEMO_MODE) offlineUntil = 0
    return response
  },
  (error) => {
    if (!DEMO_MODE && !error.response && !error.isOfflineShortCircuit) {
      offlineUntil = Date.now() + OFFLINE_TTL
    }
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
    }
    return Promise.reject(error)
  },
)

export default api
