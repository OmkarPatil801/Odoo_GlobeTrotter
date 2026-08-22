import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { CalendarDays, Globe, Lock, MapPin, Wallet } from 'lucide-react'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { formatCurrency, formatDateRange } from '../../utils/formatters'
import { staggerItem } from '../../utils/motionVariants'

const statusTone = { upcoming: 'brand', planning: 'warning', completed: 'success' }
const statusLabel = { upcoming: 'Upcoming', planning: 'Planning', completed: 'Completed' }

export function MyTripCard({ trip }) {
  const percent = trip.totalBudget
    ? Math.min(100, Math.round((trip.spentBudget / trip.totalBudget) * 100))
    : 0
  const overBudget = trip.spentBudget > trip.totalBudget

  return (
    <motion.div variants={staggerItem} whileHover={{ y: -5 }} transition={{ duration: 0.25 }}>
      <Card className="group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lift">
        <Link to={`/trips/${trip.id}`} className="relative block h-40 overflow-hidden">
          <img
            src={trip.image}
            alt={trip.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08161f]/80 via-transparent to-transparent" />
          <Badge tone={statusTone[trip.status]} className="absolute left-3 top-3">
            {statusLabel[trip.status]}
          </Badge>
          <span className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm">
            {trip.isPublic ? <Globe className="size-3.5" /> : <Lock className="size-3.5" />}
          </span>
        </Link>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="min-w-0">
            <h3 className="truncate font-display text-lg font-semibold text-fg">{trip.name}</h3>
            <p className="mt-1.5 flex items-center gap-1.5 truncate text-xs text-muted">
              <MapPin className="size-3.5 shrink-0" />
              {trip.destinations.join(' • ')}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
              <CalendarDays className="size-3.5 shrink-0" />
              {formatDateRange(trip.startDate, trip.endDate)}
            </p>
          </div>

          <div className="mt-auto">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-muted">
                <Wallet className="size-3.5" />
                {formatCurrency(trip.spentBudget)} of {formatCurrency(trip.totalBudget)}
              </span>
              <span
                className={
                  overBudget
                    ? 'font-semibold text-rose-600 dark:text-rose-400'
                    : 'font-semibold text-fg'
                }
              >
                {percent}%
              </span>
            </div>

            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-alt">
              <div
                className={
                  overBudget
                    ? 'h-full rounded-full bg-rose-500'
                    : 'h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600'
                }
                style={{ width: `${percent}%` }}
              />
            </div>

            <div className="mt-4 flex gap-2">
              <Button to={`/trips/${trip.id}`} size="sm" variant="secondary" className="flex-1">
                View Trip
              </Button>
              <Button
                to={`/trips/${trip.id}/itinerary`}
                size="sm"
                variant="ghost"
                className="flex-1"
              >
                Itinerary
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default MyTripCard
