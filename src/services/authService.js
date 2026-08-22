// Temporary localStorage-backed auth mock.
// Swap the bodies of these functions for real API calls (see services/api.js)
// once a backend exists — callers only depend on this module's shape.

const USERS_KEY = 'globetrotter-users'
const SESSION_KEY = 'globetrotter-session'

// Temporary hardcoded admin credential — the only account that gets the
// 'admin' role in this mock. A real backend would replace this whole check
// with a role column/claim on the authenticated user record.
const ADMIN_EMAIL = 'admin@globaltrotter.com'
const ADMIN_PASSWORD = 'admin123'

const DEMO_EMAIL = 'demo@globetrotter.travel'
const DEMO_PASSWORD = 'demo1234'

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || []
  } catch {
    return []
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

// Ensures the demo admin + demo user accounts exist, even if this device's
// localStorage was seeded before these accounts were added.
function ensureSeedAccounts() {
  let users = readUsers()
  let changed = false

  if (!users.some((u) => u.email.toLowerCase() === ADMIN_EMAIL)) {
    users = [
      ...users,
      {
        id: 'user-admin',
        name: 'Site Admin',
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: 'admin',
        country: 'India',
        preferences: ['Culture', 'Food'],
        createdAt: new Date().toISOString(),
      },
    ]
    changed = true
  }

  if (!users.some((u) => u.email.toLowerCase() === DEMO_EMAIL)) {
    users = [
      ...users,
      {
        id: 'user-demo',
        name: 'Ananya Rao',
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
        role: 'user',
        country: 'India',
        preferences: ['Adventure', 'Nature'],
        createdAt: new Date().toISOString(),
      },
    ]
    changed = true
  }

  if (changed) writeUsers(users)
  return users
}

function toSessionUser(user) {
  const { password: _password, ...safeUser } = user
  return safeUser
}

export function login({ email, password }) {
  const users = ensureSeedAccounts()
  const match = users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password,
  )

  if (!match) {
    return Promise.reject(new Error('Invalid email or password.'))
  }

  const sessionUser = toSessionUser(match)
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser))
  return Promise.resolve(sessionUser)
}

export function register({ name, email, password }) {
  const users = ensureSeedAccounts()
  const exists = users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())

  if (exists) {
    return Promise.reject(new Error('An account with this email already exists.'))
  }

  // Public signup always creates a traveler account. Admin accounts are
  // provisioned separately (see seedDemoAccounts) with their own credentials —
  // a real backend would enforce this the same way, via its own user table.
  const newUser = {
    id: `user-${Date.now()}`,
    name: name.trim(),
    email: email.trim(),
    password,
    role: 'user',
    country: '',
    preferences: [],
    createdAt: new Date().toISOString(),
  }

  writeUsers([...users, newUser])
  const sessionUser = toSessionUser(newUser)
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser))
  return Promise.resolve(sessionUser)
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
  return Promise.resolve()
}

export function getCurrentUser() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY))
    return Promise.resolve(session || null)
  } catch {
    return Promise.resolve(null)
  }
}

export function updateProfile(updates) {
  const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
  if (!session) return Promise.reject(new Error('Not authenticated.'))

  const updated = { ...session, ...updates }
  localStorage.setItem(SESSION_KEY, JSON.stringify(updated))

  const users = readUsers().map((u) => (u.id === updated.id ? { ...u, ...updates } : u))
  writeUsers(users)

  return Promise.resolve(updated)
}
