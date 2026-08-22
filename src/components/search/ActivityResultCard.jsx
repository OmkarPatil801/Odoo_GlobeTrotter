import { motion } from 'motion/react'
import { Check, Clock, MapPin, Plus, Star } from 'lucide-react'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import { formatCurrency } from '../../utils/formatters'
import { staggerItem } from '../../utils/motionVariants'
import { cn } from '../../utils/cn'

export function ActivityResultCard({ activity, added, onToggle }) {
  return (
    <motion.div variants={staggerItem} whileHover={{ y: -5 }} transition={{ duration: 0.25 }}>
      <Card
        className={cn(
          'group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lift',
          added && 'border-brand-500',
        )}
      >
        <div className="relative h-36 overflow-hidden">
          <img
            src={activity.image}
            alt={activity.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08161f]/70 to-transparent" />

          <Badge tone="teal" className="absolute left-3 top-3 backdrop-blur-sm">
            {activity.category}
          </Badge>
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <Star className="size-3 fill-current" />
            {activity.rating}
          </span>

          <p className="absolute inset-x-0 bottom-0 flex items-center gap-1.5 p-3 text-xs text-white/90">
            <MapPin className="size-3.5" />
            {activity.city}, {activity.country}
          </p>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-4">
          <div>
            <h3 className="font-display text-base font-semibold text-fg">{activity.name}</h3>
            <p className="mt-1 text-xs text-muted">{activity.description}</p>
          </div>

          <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-fg">{formatCurrency(activity.cost)}</p>
              <p className="flex items-center gap-1 text-xs text-muted">
                <Clock className="size-3" />
                {activity.duration}h
              </p>
            </div>

            <button
              type="button"
              onClick={() => onToggle(activity.id)}
              aria-pressed={added}
              className={cn(
                'inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors',
                added
                  ? 'bg-brand-500 text-white hover:bg-brand-600'
                  : 'border border-line bg-card text-fg hover:border-brand-500/50',
              )}
            >
              {added ? (
                <>
                  <Check className="size-3.5" />
                  Added
                </>
              ) : (
                <>
                  <Plus className="size-3.5" />
                  Add
                </>
              )}
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default ActivityResultCard
