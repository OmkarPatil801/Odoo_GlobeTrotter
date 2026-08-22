import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { LogOut, MapPin, Pencil, Route, Save, X } from 'lucide-react'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Field from '../components/ui/Field'
import Input from '../components/ui/Input'
import Dropdown from '../components/ui/Dropdown'
import PageContainer from '../components/ui/PageContainer'
import { cn } from '../utils/cn'
import useAuth from '../hooks/useAuth'
import { myTrips, profileCountryOptions, profileTravelPreferences } from '../data/mockData'

function initialsOf(name = '') {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function Profile() {
  const { user, updateProfile, logout } = useAuth()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: user?.name ?? '',
    country: user?.country ?? '',
    preferences: user?.preferences ?? [],
  })

  function togglePreference(pref) {
    setForm((f) => ({
      ...f,
      preferences: f.preferences.includes(pref)
        ? f.preferences.filter((p) => p !== pref)
        : [...f.preferences, pref],
    }))
  }

  function handleSave() {
    updateProfile(form)
    setEditing(false)
  }

  function handleCancel() {
    setForm({ name: user?.name ?? '', country: user?.country ?? '', preferences: user?.preferences ?? [] })
    setEditing(false)
  }

  async function handleLogout() {
    await logout()
    navigate('/', { replace: true })
  }

  if (!user) return null

  return (
    <PageContainer className="py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-3xl"
      >
        <Card className="p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-brand-500/15 font-display text-xl font-semibold text-brand-600 dark:text-brand-400">
                {initialsOf(user.name)}
              </span>
              <div>
                <h1 className="font-display text-xl font-semibold text-fg">{user.name}</h1>
                <p className="text-sm text-muted">{user.email}</p>
                <Badge tone={user.role === 'admin' ? 'brand' : 'success'} className="mt-2">
                  {user.role === 'admin' ? 'Admin' : 'Traveler'}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {editing ? (
                <>
                  <Button variant="secondary" size="sm" icon={X} onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button size="sm" icon={Save} onClick={handleSave}>
                    Save
                  </Button>
                </>
              ) : (
                <Button variant="secondary" size="sm" icon={Pencil} onClick={() => setEditing(true)}>
                  Edit profile
                </Button>
              )}
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Field label="Full name" htmlFor="profile-name">
              <Input
                id="profile-name"
                value={form.name}
                disabled={!editing}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </Field>
            <Field label="Country / Location">
              {editing ? (
                <Dropdown
                  options={profileCountryOptions}
                  value={form.country}
                  onChange={(v) => setForm((f) => ({ ...f, country: v }))}
                />
              ) : (
                <div className="flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2.5 text-sm text-fg">
                  <MapPin className="size-4 text-muted" />
                  {user.country || 'Not set'}
                </div>
              )}
            </Field>
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium text-fg">Travel preferences</p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {profileTravelPreferences.map((pref) => {
                const active = (editing ? form.preferences : user.preferences || []).includes(pref)
                return (
                  <button
                    key={pref}
                    type="button"
                    disabled={!editing}
                    onClick={() => togglePreference(pref)}
                    className={cn(
                      'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
                      active
                        ? 'border-brand-500/40 bg-brand-500/15 text-brand-600 dark:text-brand-400'
                        : 'border-line bg-card text-muted',
                      editing && 'cursor-pointer hover:border-brand-500/40',
                    )}
                  >
                    {pref}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-surface-alt px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-brand-500/15 text-brand-600 dark:text-brand-400">
                <Route className="size-5" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">Trips planned</p>
                <p className="font-display text-lg font-semibold text-fg">{myTrips.length}</p>
              </div>
            </div>

            <Button variant="ghost" size="sm" icon={LogOut} onClick={handleLogout}>
              Log out
            </Button>
          </div>
        </Card>
      </motion.div>
    </PageContainer>
  )
}

export default Profile
