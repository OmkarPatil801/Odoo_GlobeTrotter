import { motion } from 'motion/react'
import { CalendarDays, MapPin } from 'lucide-react'
import Card from './ui/Card'
import Button from './ui/Button'
import { formatCurrency, formatDateRange } from '../utils/formatters'
import { staggerItem } from '../utils/motionVariants'

export function PreviousTripCard({ trip }) {
  return (
    <motion.div variants={staggerItem} whileHover={{ y: -4 }} transition={{ duration: 0.25 }}>
      <Card className="flex h-full overflow-hidden transition-shadow hover:shadow-lift">
        <div className="w-32 shrink-0 overflow-hidden sm:w-40">
          <img
            src={trip.image}
            alt={trip.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 p-4 sm:p-5">
          <div className="min-w-0">
            <h3 className="truncate font-display text-base font-semibold text-fg sm:text-lg">
              {trip.name}
            </h3>

            <p className="mt-1.5 flex items-center gap-1.5 truncate text-xs text-muted">
              <MapPin className="size-3.5 shrink-0" />
              {trip.destinations.join(' • ')}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
              <CalendarDays className="size-3.5 shrink-0" />
              {formatDateRange(trip.startDate, trip.endDate)}
            </p>
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className="font-display text-base font-semibold text-brand-600 dark:text-brand-400">
              {formatCurrency(trip.totalBudget)}
            </p>
            <Button to={`/trips/${trip.id}`} size="sm" variant="secondary">
              View Trip
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default PreviousTripCard
