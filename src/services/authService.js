import api from './api'

const TOKEN_KEY = 'token'

// Backend stores role as the DB enum ('USER' | 'ADMIN'); the rest of the
// frontend (ProtectedRoute, Profile, AdminLayout) was built against a
// lowercase 'admin' | 'user' convention — normalize at this boundary
// only, same pattern as the id string<->number conversion on the server.
function fromApiUser(apiUser) {
  if (!apiUser) return null
  return { ...apiUser, role: apiUser.role === 'ADMIN' ? 'admin' : 'user' }
}

function extractErrorMessage(error, fallback) {
  return error?.response?.data?.error?.message || fallback
}

export async function login({ email, password }) {
  try {
    const res = await api.post('/auth/login', { email, password })
    const { user, token } = res.data.data
    localStorage.setItem(TOKEN_KEY, token)
    return fromApiUser(user)
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Invalid email or password.'))
  }
}

export async function register({ name, email, password }) {
  try {
    const res = await api.post('/auth/register', { name, email, password })
    const { user, token } = res.data.data
    localStorage.setItem(TOKEN_KEY, token)
    return fromApiUser(user)
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Could not create an account.'))
  }
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
  return Promise.resolve()
}

export async function getCurrentUser() {
  if (!localStorage.getItem(TOKEN_KEY)) return null

  try {
    const res = await api.get('/users/me')
    return fromApiUser(res.data.data.user)
  } catch {
    // Token missing/expired/invalid — clear it so future calls don't
    // keep re-attempting a session that no longer exists.
    localStorage.removeItem(TOKEN_KEY)
    return null
  }
}

export async function updateProfile(updates) {
  try {
    const res = await api.put('/users/me', updates)
    return fromApiUser(res.data.data.user)
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Could not update profile.'))
  }
}
