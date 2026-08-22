import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { Compass, LogIn, ShieldCheck, User, Wand2 } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Field from '../components/ui/Field'
import Input from '../components/ui/Input'
import useAuth from '../hooks/useAuth'
import { DEMO_CREDENTIALS } from '../services/authService'
import { heroImage } from '../data/mockData'

const MODES = {
  user: {
    key: 'user',
    label: 'User',
    icon: User,
    eyebrow: 'Traveler sign in',
    title: 'Log in',
    blurb: 'Pick up your trips, budgets, and itineraries right where you left off.',
    panelTitle: 'Welcome back to your journey.',
    panelBlurb: 'Sign in to pick up your trips, budgets, and itineraries right where you left off.',
  },
  admin: {
    key: 'admin',
    label: 'Admin',
    icon: ShieldCheck,
    eyebrow: 'Administrator access',
    title: 'Admin log in',
    blurb: 'Manage users, trips, destinations, and platform analytics.',
    panelTitle: 'GlobeTrotter Control Center.',
    panelBlurb: 'Moderate destinations, review trips, and track platform growth in one place.',
  },
}

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mode, setMode] = useState(location.state?.mode === 'admin' ? 'admin' : 'user')
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const config = MODES[mode]
  const isAdmin = mode === 'admin'

  function switchMode(next) {
    setMode(next)
    setForm({ email: '', password: '' })
    setError('')
    setSuccess('')
  }

  function fillDemo() {
    setForm({ ...DEMO_CREDENTIALS[mode] })
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.email.trim() || !form.password) {
      setError('Please enter both your email and password.')
      return
    }

    setSubmitting(true)
    try {
      const sessionUser = await login({ ...form, role: mode })
      setSuccess(`Welcome back, ${sessionUser.name?.split(' ')[0] || 'traveler'}! Redirecting…`)
      const from = location.state?.from?.pathname
      const target = sessionUser.role === 'admin' ? '/admin' : from || '/dashboard'
      setTimeout(() => navigate(target, { replace: true }), 550)
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div
          className={`absolute inset-0 transition-colors duration-500 ${
            isAdmin
              ? 'bg-gradient-to-b from-[#0b1020]/80 via-[#131a36]/70 to-[#05070f]/90'
              : 'bg-gradient-to-b from-[#06131c]/60 via-[#06131c]/30 to-[#06131c]/80'
          }`}
        />
        <div className="relative flex h-full flex-col justify-end p-12 text-white">
          <span
            className={`flex size-11 items-center justify-center rounded-full ${
              isAdmin ? 'bg-indigo-500' : 'bg-brand-500'
            }`}
          >
            {isAdmin ? (
              <ShieldCheck className="size-5" strokeWidth={2.5} />
            ) : (
              <Compass className="size-5" strokeWidth={2.5} />
            )}
          </span>
          <h2 className="mt-6 font-display text-3xl font-semibold leading-tight">
            {config.panelTitle}
          </h2>
          <p className="mt-3 max-w-sm text-white/80">{config.panelBlurb}</p>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-16 sm:px-6">
        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Card className="p-6 sm:p-8">
            <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl border border-line bg-surface-alt p-1">
              {Object.values(MODES).map((m) => {
                const Icon = m.icon
                const active = m.key === mode
                const activeClass =
                  m.key === 'admin'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-brand-500 text-white shadow-sm'
                return (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => switchMode(m.key)}
                    className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      active ? activeClass : 'text-muted hover:text-fg'
                    }`}
                  >
                    <Icon className="size-4" />
                    {m.label}
                  </button>
                )
              })}
            </div>

            <p
              className={`text-xs font-semibold uppercase tracking-[0.18em] ${
                isAdmin
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-brand-600 dark:text-brand-400'
              }`}
            >
              {config.eyebrow}
            </p>
            <h1 className="mt-1 font-display text-2xl font-semibold text-fg">{config.title}</h1>
            <p className="mt-1 text-sm text-muted">{config.blurb}</p>

            <div
              className={`mt-4 flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 ${
                isAdmin
                  ? 'border-indigo-500/30 bg-indigo-500/10'
                  : 'border-brand-500/30 bg-brand-500/10'
              }`}
            >
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                  Demo {config.label} account
                </p>
                <p className="truncate text-xs font-medium text-fg">
                  {DEMO_CREDENTIALS[mode].email} / {DEMO_CREDENTIALS[mode].password}
                </p>
              </div>
              <button
                type="button"
                onClick={fillDemo}
                className={`inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white transition-transform hover:scale-105 ${
                  isAdmin ? 'bg-indigo-600' : 'bg-brand-500'
                }`}
              >
                <Wand2 className="size-3.5" />
                Fill
              </button>
            </div>

            <form className="mt-5 flex flex-col gap-4" onSubmit={handleSubmit}>
              <Field label="Email" htmlFor="login-email">
                <Input
                  id="login-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder={isAdmin ? 'admin@globetrotter.app' : 'you@example.com'}
                />
              </Field>
              <Field label="Password" htmlFor="login-password">
                <Input
                  id="login-password"
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                />
              </Field>

              {error && (
                <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-600 dark:text-rose-400">
                  {error}
                </p>
              )}
              {success && (
                <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-600 dark:text-emerald-400">
                  {success}
                </p>
              )}

              <Button
                type="submit"
                size="lg"
                icon={isAdmin ? ShieldCheck : LogIn}
                disabled={submitting}
                className={`mt-2 ${isAdmin ? '!bg-indigo-600 hover:!bg-indigo-500' : ''}`}
              >
                {submitting ? 'Signing in…' : isAdmin ? 'Enter Admin Dashboard' : 'Log in'}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted">
              {isAdmin ? (
                <>
                  Not an admin?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('user')}
                    className="font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400"
                  >
                    Traveler login
                  </button>
                </>
              ) : (
                <>
                  Don&apos;t have an account?{' '}
                  <Link
                    to="/register"
                    className="font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default Login
