import { motion } from 'motion/react'
import { MapPin, Plane, BedDouble, Camera, UtensilsCrossed, Circle } from 'lucide-react'
import Card from '../ui/Card'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { staggerItem } from '../../utils/motionVariants'

const typeMeta = {
  travel: { icon: Plane, className: 'bg-sky-500/15 text-sky-600 dark:text-sky-400' },
  hotel: { icon: BedDouble, className: 'bg-teal-500/15 text-teal-600 dark:text-teal-400' },
  activity: { icon: Camera, className: 'bg-brand-500/15 text-brand-600 dark:text-brand-400' },
  restaurant: { icon: UtensilsCrossed, className: 'bg-amber-500/15 text-amber-600 dark:text-amber-400' },
  other: { icon: Circle, className: 'bg-surface-alt text-muted' },
}

export function ItineraryDay({ day }) {
  const dayTotal = day.items.reduce((sum, item) => sum + item.cost, 0)

  return (
    <motion.div variants={staggerItem}>
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface-alt px-5 py-3.5">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-brand-500 font-display text-sm font-semibold text-white">
              {day.dayNumber}
            </span>
            <div>
              <p className="font-display text-sm font-semibold text-fg">{formatDate(day.date)}</p>
              <p className="flex items-center gap-1 text-xs text-muted">
                <MapPin className="size-3" />
                {day.city}
              </p>
            </div>
          </div>
          <span className="text-sm font-semibold text-fg">{formatCurrency(dayTotal)}</span>
        </div>

        <ul className="flex flex-col">
          {day.items.map((item, index) => {
            const meta = typeMeta[item.type] ?? typeMeta.other
            const Icon = meta.icon

            return (
              <li
                key={item.id}
                className={`flex gap-4 px-5 py-4 ${index > 0 ? 'border-t border-line' : ''}`}
              >
                <div className="flex w-14 shrink-0 flex-col items-center gap-2">
                  <span className="text-xs font-semibold text-muted">{item.time}</span>
                  <span className={`flex size-8 items-center justify-center rounded-full ${meta.className}`}>
                    <Icon className="size-4" />
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-4">
                    <h4 className="truncate font-display text-sm font-semibold text-fg">
                      {item.title}
                    </h4>
                    <span className="shrink-0 text-sm text-muted">{formatCurrency(item.cost)}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted">{item.description}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </Card>
    </motion.div>
  )
}

export default ItineraryDay
