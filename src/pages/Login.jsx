import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { Compass, LogIn } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Field from '../components/ui/Field'
import Input from '../components/ui/Input'
import useAuth from '../hooks/useAuth'
import { heroImage } from '../data/mockData'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const sessionUser = await login(form)
      const from = location.state?.from?.pathname
      navigate(from || (sessionUser.role === 'admin' ? '/admin' : '/dashboard'), { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#06131c]/60 via-[#06131c]/30 to-[#06131c]/80" />
        <div className="relative flex h-full flex-col justify-end p-12 text-white">
          <span className="flex size-11 items-center justify-center rounded-full bg-brand-500">
            <Compass className="size-5" strokeWidth={2.5} />
          </span>
          <h2 className="mt-6 font-display text-3xl font-semibold leading-tight">
            Welcome back to your journey.
          </h2>
          <p className="mt-3 max-w-sm text-white/80">
            Sign in to pick up your trips, budgets, and itineraries right where you left off.
          </p>
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
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
              Sign in
            </p>
            <h1 className="mt-1 font-display text-2xl font-semibold text-fg">Log in</h1>
            <p className="mt-1 text-sm text-muted">
              Use{' '}
              <span className="font-medium text-fg">demo@globetrotter.app</span> /{' '}
              <span className="font-medium text-fg">Demo@123</span> to explore.
            </p>

            <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
              <Field label="Email" htmlFor="login-email">
                <Input
                  id="login-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
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

              {error && <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}

              <Button type="submit" size="lg" icon={LogIn} disabled={submitting} className="mt-2">
                {submitting ? 'Signing in…' : 'Log in'}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400">
                Sign up
              </Link>
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default Login
