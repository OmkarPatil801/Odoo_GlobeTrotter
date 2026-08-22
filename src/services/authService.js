import api from './api'

const TOKEN_KEY = 'token'
const DEMO_USER_KEY = 'gt_demo_user'
const DEMO_ACCOUNTS_KEY = 'gt_demo_accounts'

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

// The API may be offline during a demo. Anything that isn't a real HTTP
// response from the backend (network error, connection refused, timeout)
// means we should serve the local demo session instead of failing.
function isOffline(error) {
  return !error?.response
}

/* ---------------- Local demo session (offline fallback) ---------------- */

export const DEMO_CREDENTIALS = {
  user: { email: 'demo@globetrotter.app', password: 'Demo@123' },
  admin: { email: 'admin@globetrotter.app', password: 'Admin@123' },
}

const SEED_ACCOUNTS = [
  {
    id: 'demo-user-1',
    name: 'Ananya Rao',
    email: DEMO_CREDENTIALS.user.email,
    password: DEMO_CREDENTIALS.user.password,
    role: 'user',
    city: 'Bengaluru',
    country: 'India',
    avatar: 'https://i.pravatar.cc/150?img=47',
  },
  {
    id: 'demo-admin-1',
    name: 'Riya Sharma',
    email: DEMO_CREDENTIALS.admin.email,
    password: DEMO_CREDENTIALS.admin.password,
    role: 'admin',
    city: 'Mumbai',
    country: 'India',
    avatar: 'https://i.pravatar.cc/150?img=32',
  },
]

function readAccounts() {
  try {
    const stored = JSON.parse(localStorage.getItem(DEMO_ACCOUNTS_KEY) || '[]')
    const extras = stored.filter((a) => !SEED_ACCOUNTS.some((s) => s.email === a.email))
    return [...SEED_ACCOUNTS, ...extras]
  } catch {
    return [...SEED_ACCOUNTS]
  }
}

function writeAccount(account) {
  try {
    const stored = JSON.parse(localStorage.getItem(DEMO_ACCOUNTS_KEY) || '[]')
    localStorage.setItem(
      DEMO_ACCOUNTS_KEY,
      JSON.stringify([...stored.filter((a) => a.email !== account.email), account]),
    )
  } catch {
    /* storage unavailable — session still works for this page load */
  }
}

function startDemoSession(account) {
  const { password: _password, ...safe } = account
  localStorage.setItem(TOKEN_KEY, `demo.${safe.id}`)
  localStorage.setItem(DEMO_USER_KEY, JSON.stringify(safe))
  return safe
}

function demoLogin({ email, password, role }) {
  const normalized = String(email || '').trim().toLowerCase()
  const account = readAccounts().find((a) => a.email.toLowerCase() === normalized)

  if (!account || account.password !== password) {
    throw new Error('Invalid email or password. Try the demo credentials shown above.')
  }
  if (role && account.role !== role) {
    throw new Error(
      role === 'admin'
        ? 'That account does not have admin access.'
        : 'Please use the Admin tab to sign in with an admin account.',
    )
  }
  return startDemoSession(account)
}

function demoRegister({ name, email, password }) {
  const normalized = String(email || '').trim().toLowerCase()
  if (readAccounts().some((a) => a.email.toLowerCase() === normalized)) {
    throw new Error('An account with that email already exists.')
  }
  const account = {
    id: `demo-user-${Date.now()}`,
    name,
    email: normalized,
    password,
    role: 'user',
    city: '',
    country: '',
    avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(normalized)}`,
  }
  writeAccount(account)
  return startDemoSession(account)
}

function readDemoSession() {
  try {
    const raw = localStorage.getItem(DEMO_USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/* ----------------------------- Public API ----------------------------- */

export async function login({ email, password, role }) {
  try {
    const res = await api.post('/auth/login', { email, password })
    const { user, token } = res.data.data
    const sessionUser = fromApiUser(user)
    if (role && sessionUser.role !== role) {
      throw new Error(
        role === 'admin'
          ? 'That account does not have admin access.'
          : 'Please use the Admin tab to sign in with an admin account.',
      )
    }
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.removeItem(DEMO_USER_KEY)
    return sessionUser
  } catch (error) {
    if (isOffline(error)) return demoLogin({ email, password, role })
    throw new Error(extractErrorMessage(error, 'Invalid email or password.'))
  }
}

export async function register({ name, email, password }) {
  try {
    const res = await api.post('/auth/register', { name, email, password })
    const { user, token } = res.data.data
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.removeItem(DEMO_USER_KEY)
    return fromApiUser(user)
  } catch (error) {
    if (isOffline(error)) return demoRegister({ name, email, password })
    throw new Error(extractErrorMessage(error, 'Could not create an account.'))
  }
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(DEMO_USER_KEY)
  return Promise.resolve()
}

export async function getCurrentUser() {
  if (!localStorage.getItem(TOKEN_KEY)) return null

  const demoSession = readDemoSession()
  if (demoSession) return demoSession

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
  const demoSession = readDemoSession()
  if (demoSession) {
    const updated = { ...demoSession, ...updates }
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(updated))
    return updated
  }

  try {
    const res = await api.put('/users/me', updates)
    return fromApiUser(res.data.data.user)
  } catch (error) {
    if (isOffline(error)) return { ...readDemoSession(), ...updates }
    throw new Error(extractErrorMessage(error, 'Could not update profile.'))
  }
}
