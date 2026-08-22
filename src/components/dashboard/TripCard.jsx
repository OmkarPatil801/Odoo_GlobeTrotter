import { motion } from 'motion/react'
import { CalendarDays, MapPin } from 'lucide-react'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { formatCurrency, formatDateRange } from '../../utils/formatters'
import { cardHover, staggerItem } from '../../utils/motionVariants'

const statusTone = {
  upcoming: 'brand',
  planning: 'warning',
  completed: 'success',
}

const statusLabel = {
  upcoming: 'Upcoming',
  planning: 'Planning',
  completed: 'Completed',
}

export function TripCard({ trip }) {
  return (
    <motion.div variants={staggerItem} initial="rest" whileHover="hover" animate="rest">
      <motion.div variants={cardHover}>
        <Card className="group overflow-hidden">
          <div className="relative h-44 overflow-hidden">
            <img
              src={trip.image}
              alt={trip.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08161f]/90 via-[#08161f]/10 to-transparent" />
            <Badge tone={statusTone[trip.status]} className="absolute right-3 top-3">
              {statusLabel[trip.status]}
            </Badge>
          </div>

          <div className="p-5">
            <h3 className="font-display text-lg font-semibold text-fg">{trip.name}</h3>

            <div className="mt-2.5 flex items-center gap-1.5 text-xs text-muted">
              <CalendarDays className="size-3.5" />
              {formatDateRange(trip.startDate, trip.endDate)}
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted">
              <MapPin className="size-3.5" />
              {trip.destinationCount} destination{trip.destinationCount > 1 ? 's' : ''}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-muted">Budget</p>
                <p className="font-display text-base font-semibold text-brand-600 dark:text-brand-400">
                  {formatCurrency(trip.totalBudget)}
                </p>
              </div>
              <Button to={`/trips/${trip.id}`} size="sm" variant="secondary">
                View Trip
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}

export default TripCard
