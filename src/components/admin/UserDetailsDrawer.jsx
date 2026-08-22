import { AnimatePresence, motion } from 'motion/react'
import { Ban, CalendarDays, Globe2, Mail, Route, ShieldCheck, Wallet, X } from 'lucide-react'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { formatCurrency, formatDate } from '../../utils/formatters'

const statusTone = { active: 'success', pending: 'warning', suspended: 'brand' }

export function UserDetailsDrawer({ user, onClose, onToggleStatus }) {
  return (
    <AnimatePresence>
      {user && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="absolute inset-0 bg-[#08161f]/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={`Details for ${user.name}`}
            className="relative flex h-full w-full max-w-md flex-col border-l border-line bg-card shadow-lift"
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
              <h2 className="font-display text-base font-semibold text-fg">User details</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="rounded-full p-1.5 text-muted transition-colors hover:bg-surface-alt hover:text-fg"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <div className="flex items-center gap-4">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-brand-500/15 font-display text-lg font-semibold text-brand-600 dark:text-brand-400">
                  {user.initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-display text-lg font-semibold text-fg">{user.name}</p>
                  <p className="truncate text-sm text-muted">{user.email}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <Badge tone={statusTone[user.status]}>{user.status}</Badge>
                    <Badge tone="teal">{user.role}</Badge>
                  </div>
                </div>
              </div>

              <dl className="mt-6 grid grid-cols-2 gap-3">
                {[
                  ['Trips', `${user.trips}`, Route],
                  ['Total spend', formatCurrency(user.totalSpend), Wallet],
                  ['Registered', formatDate(user.joinedAt), CalendarDays],
                  ['Last active', formatDate(user.lastActive), ShieldCheck],
                  ['Country', user.country, Globe2],
                  ['User ID', user.id, Mail],
                ].map(([label, value, Icon]) => (
                  <div key={label} className="rounded-xl border border-line bg-surface-alt p-3">
                    <dt className="flex items-center gap-1.5 text-xs text-muted">
                      <Icon className="size-3.5" />
                      {label}
                    </dt>
                    <dd className="mt-1 truncate text-sm font-semibold text-fg">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="flex gap-2 border-t border-line p-5">
              <Button
                variant="secondary"
                size="md"
                className="flex-1"
                onClick={() => onToggleStatus(user.id)}
                icon={user.status === 'suspended' ? ShieldCheck : Ban}
              >
                {user.status === 'suspended' ? 'Reactivate' : 'Deactivate'}
              </Button>
              <Button size="md" className="flex-1" onClick={onClose}>
                Done
              </Button>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default UserDetailsDrawer
