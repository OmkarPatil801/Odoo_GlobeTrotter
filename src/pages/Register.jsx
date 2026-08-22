import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { Compass, UserPlus } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Field from '../components/ui/Field'
import Input from '../components/ui/Input'
import useAuth from '../hooks/useAuth'
import { landingHeroImage } from '../data/mockData'

function Register() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function validate() {
    if (form.name.trim().length < 2) return 'Please enter your full name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return 'Please enter a valid email address.'
    if (form.password.length < 6) return 'Password must be at least 6 characters.'
    if (form.password !== form.confirm) return 'Passwords do not match.'
    return ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    const message = validate()
    if (message) {
      setError(message)
      return
    }

    setSubmitting(true)
    try {
      const created = await signup({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      })
      setSuccess(`Account created. Welcome aboard, ${created?.name?.split(' ')[0] || 'traveler'}!`)
      setTimeout(() => navigate('/dashboard', { replace: true }), 650)
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img src={landingHeroImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#06131c]/60 via-[#06131c]/30 to-[#06131c]/80" />
        <div className="relative flex h-full flex-col justify-end p-12 text-white">
          <span className="flex size-11 items-center justify-center rounded-full bg-brand-500">
            <Compass className="size-5" strokeWidth={2.5} />
          </span>
          <h2 className="mt-6 font-display text-3xl font-semibold leading-tight">
            Your next trip starts here.
          </h2>
          <p className="mt-3 max-w-sm text-white/80">
            Create an account to build itineraries, track budgets, and share your journeys.
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
              Create account
            </p>
            <h1 className="mt-1 font-display text-2xl font-semibold text-fg">Sign up</h1>
            <p className="mt-1 text-sm text-muted">Start planning in under a minute.</p>

            <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
              <Field label="Full name" htmlFor="register-name">
                <Input
                  id="register-name"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Ananya Rao"
                />
              </Field>
              <Field label="Email" htmlFor="register-email">
                <Input
                  id="register-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                />
              </Field>
              <Field label="Password" htmlFor="register-password">
                <Input
                  id="register-password"
                  type="password"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="At least 6 characters"
                />
              </Field>

              <Field label="Confirm password" htmlFor="register-confirm">
                <Input
                  id="register-confirm"
                  type="password"
                  required
                  value={form.confirm}
                  onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
                  placeholder="Re-enter your password"
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

              <Button type="submit" size="lg" icon={UserPlus} disabled={submitting} className="mt-2">
                {submitting ? 'Creating account…' : 'Sign up'}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted">
              Are you an administrator?{' '}
              <Link
                to="/login"
                state={{ mode: 'admin' }}
                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
              >
                Admin login
              </Link>
            </p>
            <p className="mt-2 text-center text-sm text-muted">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400">
                Log in
              </Link>
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default Register
