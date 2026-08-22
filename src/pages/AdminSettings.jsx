import { useState } from 'react'
import { motion } from 'motion/react'
import { AnimatePresence } from 'motion/react'
import { Check, RotateCcw, Save, ShieldCheck } from 'lucide-react'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Field from '../components/ui/Field'
import Input from '../components/ui/Input'
import Dropdown from '../components/ui/Dropdown'
import ThemeToggle from '../components/ui/ThemeToggle'
import { cn } from '../utils/cn'
import {
  adminCurrencyOptions,
  adminLanguageOptions,
  adminNotificationPreferences,
  adminProfile,
  adminSitePreferences,
  adminTimezoneOptions,
  adminTravelSettings,
  adminTripVisibilityOptions,
} from '../data/adminMockData'

function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative flex h-6 w-11 shrink-0 items-center rounded-full transition-colors',
        checked ? 'bg-brand-500' : 'bg-line',
      )}
    >
      <motion.span
        className="size-4.5 rounded-full bg-white shadow-sm"
        animate={{ x: checked ? 22 : 3 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
      />
    </button>
  )
}

function SettingsRow({ label, hint, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-fg">{label}</p>
        {hint && <p className="mt-0.5 text-xs text-muted">{hint}</p>}
      </div>
      {children}
    </div>
  )
}

function AdminSettings() {
  const [profile, setProfile] = useState(adminProfile)
  const [preferences, setPreferences] = useState(adminSitePreferences)
  const [notifications, setNotifications] = useState(adminNotificationPreferences)
  const [travel, setTravel] = useState(adminTravelSettings)
  const [savedAt, setSavedAt] = useState(null)

  function handleSave() {
    // API-ready: replace with a service call, e.g. adminSettingsService.update({...})
    setSavedAt(Date.now())
    setTimeout(() => setSavedAt(null), 2200)
  }

  function handleReset() {
    setProfile(adminProfile)
    setPreferences(adminSitePreferences)
    setNotifications(adminNotificationPreferences)
    setTravel(adminTravelSettings)
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
            Configuration
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-fg lg:text-3xl">
            Settings
          </h1>
          <p className="mt-1 text-sm text-muted">
            Admin profile, site preferences, and platform behavior.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <AnimatePresence>
            {savedAt && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
              >
                <Badge tone="success">
                  <Check className="size-3" /> Saved
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
          <Button variant="secondary" size="md" icon={RotateCcw} onClick={handleReset}>
            Reset
          </Button>
          <Button variant="primary" size="md" icon={Save} onClick={handleSave}>
            Save changes
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card className="p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-full bg-brand-500/15 text-sm font-semibold text-brand-600 dark:text-brand-400">
              {profile.initials}
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-base font-semibold text-fg">Admin profile</h2>
              <p className="truncate text-xs text-muted">{profile.role}</p>
            </div>
            <Badge tone="brand">
              <ShieldCheck className="size-3" /> Verified
            </Badge>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Full name" htmlFor="profile-name">
              <Input
                id="profile-name"
                value={profile.name}
                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              />
            </Field>
            <Field label="Email" htmlFor="profile-email">
              <Input
                id="profile-email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
              />
            </Field>
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <h2 className="font-display text-base font-semibold text-fg">Appearance</h2>
          <p className="text-xs text-muted">Choose how the admin console looks for you</p>

          <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-line bg-surface-alt px-4 py-3.5">
            <div>
              <p className="text-sm font-medium text-fg">Theme</p>
              <p className="text-xs text-muted">Light or dark mode</p>
            </div>
            <ThemeToggle />
          </div>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card className="p-5 sm:p-6">
          <h2 className="font-display text-base font-semibold text-fg">Site preferences</h2>
          <p className="text-xs text-muted">Defaults applied across the platform</p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Site name" htmlFor="site-name">
              <Input
                id="site-name"
                value={preferences.siteName}
                onChange={(e) => setPreferences((p) => ({ ...p, siteName: e.target.value }))}
              />
            </Field>
            <Field label="Support email" htmlFor="support-email">
              <Input
                id="support-email"
                type="email"
                value={preferences.supportEmail}
                onChange={(e) => setPreferences((p) => ({ ...p, supportEmail: e.target.value }))}
              />
            </Field>
            <Field label="Default currency">
              <Dropdown
                options={adminCurrencyOptions}
                value={preferences.defaultCurrency}
                onChange={(v) => setPreferences((p) => ({ ...p, defaultCurrency: v }))}
              />
            </Field>
            <Field label="Timezone">
              <Dropdown
                options={adminTimezoneOptions}
                value={preferences.timezone}
                onChange={(v) => setPreferences((p) => ({ ...p, timezone: v }))}
              />
            </Field>
            <Field label="Language" className="sm:col-span-2">
              <Dropdown
                options={adminLanguageOptions}
                value={preferences.language}
                onChange={(v) => setPreferences((p) => ({ ...p, language: v }))}
                className="sm:max-w-xs"
              />
            </Field>
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <h2 className="font-display text-base font-semibold text-fg">Notification preferences</h2>
          <p className="text-xs text-muted">Choose what triggers an alert to you</p>

          <div className="mt-2 divide-y divide-line">
            <SettingsRow label="Email alerts" hint="Critical platform events">
              <Switch
                checked={notifications.emailAlerts}
                onChange={(v) => setNotifications((p) => ({ ...p, emailAlerts: v }))}
                label="Email alerts"
              />
            </SettingsRow>
            <SettingsRow label="New user signups" hint="Notify when someone joins">
              <Switch
                checked={notifications.newUserSignups}
                onChange={(v) => setNotifications((p) => ({ ...p, newUserSignups: v }))}
                label="New user signups"
              />
            </SettingsRow>
            <SettingsRow label="Trip activity" hint="Notify on new trips created">
              <Switch
                checked={notifications.tripActivity}
                onChange={(v) => setNotifications((p) => ({ ...p, tripActivity: v }))}
                label="Trip activity"
              />
            </SettingsRow>
            <SettingsRow label="Weekly digest" hint="Summary every Monday">
              <Switch
                checked={notifications.weeklyDigest}
                onChange={(v) => setNotifications((p) => ({ ...p, weeklyDigest: v }))}
                label="Weekly digest"
              />
            </SettingsRow>
            <SettingsRow label="Marketing emails" hint="Product news and offers">
              <Switch
                checked={notifications.marketingEmails}
                onChange={(v) => setNotifications((p) => ({ ...p, marketingEmails: v }))}
                label="Marketing emails"
              />
            </SettingsRow>
          </div>
        </Card>
      </div>

      <Card className="mt-5 p-5 sm:p-6">
        <h2 className="font-display text-base font-semibold text-fg">Travel &amp; site settings</h2>
        <p className="text-xs text-muted">Behavior for trips, destinations, and the platform</p>

        <div className="mt-4 grid gap-x-8 sm:grid-cols-2">
          <div className="divide-y divide-line">
            <SettingsRow label="Default trip visibility" hint="Applied to new trips">
              <Dropdown
                options={adminTripVisibilityOptions}
                value={travel.defaultTripVisibility}
                onChange={(v) => setTravel((p) => ({ ...p, defaultTripVisibility: v }))}
                className="w-48"
              />
            </SettingsRow>
            <SettingsRow label="Allow public itineraries" hint="Travelers can publish to community">
              <Switch
                checked={travel.allowPublicItineraries}
                onChange={(v) => setTravel((p) => ({ ...p, allowPublicItineraries: v }))}
                label="Allow public itineraries"
              />
            </SettingsRow>
          </div>
          <div className="divide-y divide-line">
            <SettingsRow label="Auto-approve destinations" hint="Skip manual review on submit">
              <Switch
                checked={travel.autoApproveDestinations}
                onChange={(v) => setTravel((p) => ({ ...p, autoApproveDestinations: v }))}
                label="Auto-approve destinations"
              />
            </SettingsRow>
            <SettingsRow label="Maintenance mode" hint="Show a maintenance banner site-wide">
              <Switch
                checked={travel.maintenanceMode}
                onChange={(v) => setTravel((p) => ({ ...p, maintenanceMode: v }))}
                label="Maintenance mode"
              />
            </SettingsRow>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default AdminSettings
