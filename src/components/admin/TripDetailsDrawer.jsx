import { AnimatePresence, motion } from 'motion/react'
import { CalendarDays, Globe, Lock, MapPin, Ticket, User, Wallet, X } from 'lucide-react'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { formatCurrency, formatDate, formatDateRange } from '../../utils/formatters'

const statusTone = { upcoming: 'brand', planning: 'warning', completed: 'success' }

const MS_PER_DAY = 86400000

export function TripDetailsDrawer({ trip, onClose, onDelete }) {
  const days = trip
    ? Math.round((new Date(trip.endDate) - new Date(trip.startDate)) / MS_PER_DAY) + 1
    : 0
  const activitiesTotal = trip?.activities.reduce((s, a) => s + a.cost, 0) ?? 0
  const percent = trip?.budget ? Math.min(100, Math.round((trip.spent / trip.budget) * 100)) : 0
  const overBudget = trip ? trip.spent > trip.budget : false

  return (
    <AnimatePresence>
      {trip && (
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
            aria-label={`Details for ${trip.name}`}
            className="relative flex h-full w-full max-w-lg flex-col border-l border-line bg-card shadow-lift"
            initial={{ x: 480 }}
            animate={{ x: 0 }}
            exit={{ x: 480 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
              <h2 className="font-display text-base font-semibold text-fg">Trip details</h2>
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
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={statusTone[trip.status]}>{trip.status}</Badge>
                <Badge tone="neutral">
                  <span className="flex items-center gap-1">
                    {trip.isPublic ? <Globe className="size-3" /> : <Lock className="size-3" />}
                    {trip.isPublic ? 'Public' : 'Private'}
                  </span>
                </Badge>
              </div>

              <h3 className="mt-3 font-display text-xl font-semibold text-fg">{trip.name}</h3>
              <p className="mt-1.5 text-sm text-muted">{trip.summary}</p>

              <div className="mt-4 flex items-center gap-2">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-500/15 text-[10px] font-semibold text-brand-600 dark:text-brand-400">
                  {trip.ownerInitials}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-muted">
                  <User className="size-3.5" />
                  {trip.owner}
                </span>
              </div>

              <dl className="mt-5 grid grid-cols-2 gap-3">
                {[
                  ['Dates', formatDateRange(trip.startDate, trip.endDate), CalendarDays],
                  ['Duration', `${days} days`, CalendarDays],
                  ['Destinations', `${trip.destinations.length}`, MapPin],
                  ['Activities', `${trip.activities.length}`, Ticket],
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

              <section className="mt-6">
                <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  Destinations
                </h4>
                <ul className="mt-2.5 flex flex-col gap-2">
                  {trip.destinations.map((city, i) => (
                    <li key={city} className="flex items-center gap-3">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-500/15 text-[10px] font-semibold text-brand-600 dark:text-brand-400">
                        {i + 1}
                      </span>
                      <span className="text-sm text-fg">{city}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mt-6">
                <div className="flex items-center gap-2">
                  <Wallet className="size-4 text-brand-500" />
                  <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                    Budget
                  </h4>
                </div>

                <p className="mt-2 font-display text-xl font-semibold text-fg">
                  {formatCurrency(trip.budget)}
                </p>

                <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-surface-alt">
                  <div
                    className={
                      overBudget
                        ? 'h-full rounded-full bg-rose-500'
                        : 'h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600'
                    }
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-muted">
                    Spent <span className="font-semibold text-fg">{formatCurrency(trip.spent)}</span>
                  </span>
                  <span
                    className={
                      overBudget
                        ? 'font-semibold text-rose-600 dark:text-rose-400'
                        : 'font-semibold text-emerald-600 dark:text-emerald-400'
                    }
                  >
                    {overBudget
                      ? `${formatCurrency(trip.spent - trip.budget)} over`
                      : `${formatCurrency(trip.budget - trip.spent)} left`}
                  </span>
                </div>
              </section>

              <section className="mt-6">
                <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  Activities · {formatCurrency(activitiesTotal)}
                </h4>
                <ul className="mt-2.5 flex flex-col rounded-xl border border-line">
                  {trip.activities.map((a, i) => (
                    <li
                      key={a.id}
                      className={`flex items-center gap-3 px-3.5 py-2.5 ${i > 0 ? 'border-t border-line' : ''}`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-fg">{a.name}</p>
                        <p className="truncate text-xs text-muted">{a.city}</p>
                      </div>
                      <span className="shrink-0 text-sm font-semibold text-fg">
                        {formatCurrency(a.cost)}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              <p className="mt-5 text-xs text-muted">Created {formatDate(trip.createdAt)}</p>
            </div>

            <div className="flex gap-2 border-t border-line p-5">
              <Button
                variant="secondary"
                size="md"
                className="flex-1"
                onClick={() => onDelete(trip.id)}
              >
                Delete trip
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

export default TripDetailsDrawer
