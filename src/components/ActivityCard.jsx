import { motion } from 'motion/react'
import { Check, Plus } from 'lucide-react'
import Card from './ui/Card'
import Badge from './ui/Badge'
import { formatCurrency } from '../utils/formatters'
import { staggerItem } from '../utils/motionVariants'
import { cn } from '../utils/cn'

export function ActivityCard({ activity, selected, onToggle }) {
  return (
    <motion.div variants={staggerItem} whileHover={{ y: -4 }} transition={{ duration: 0.25 }}>
      <Card
        className={cn(
          'group h-full overflow-hidden transition-all',
          selected ? 'border-brand-500 shadow-lift' : 'hover:shadow-lift',
        )}
      >
        <div className="relative h-36 overflow-hidden">
          <img
            src={activity.image}
            alt={activity.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08161f]/60 to-transparent" />
          <Badge tone="teal" className="absolute left-3 top-3 backdrop-blur-sm">
            {activity.category}
          </Badge>
          {selected && (
            <span className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-full bg-brand-500 text-white">
              <Check className="size-3.5" strokeWidth={3} />
            </span>
          )}
        </div>

        <div className="flex flex-col gap-3 p-4">
          <div>
            <h3 className="font-display text-base font-semibold text-fg">{activity.name}</h3>
            <p className="mt-1 text-xs text-muted">{activity.description}</p>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-fg">
              {formatCurrency(activity.estimatedCost)}
            </span>

            <button
              type="button"
              onClick={() => onToggle(activity.id)}
              aria-pressed={selected}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors',
                selected
                  ? 'bg-brand-500 text-white hover:bg-brand-600'
                  : 'border border-line bg-card text-fg hover:border-brand-500/50',
              )}
            >
              {selected ? (
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

export default ActivityCard
