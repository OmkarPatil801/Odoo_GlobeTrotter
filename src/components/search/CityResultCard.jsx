import { motion } from 'motion/react'
import { Check, Plus, Star, Ticket } from 'lucide-react'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import { staggerItem } from '../../utils/motionVariants'
import { cn } from '../../utils/cn'

export function CityResultCard({ city, added, onToggle }) {
  return (
    <motion.div variants={staggerItem} whileHover={{ y: -5 }} transition={{ duration: 0.25 }}>
      <Card
        className={cn(
          'group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lift',
          added && 'border-brand-500',
        )}
      >
        <div className="relative h-40 overflow-hidden">
          <img
            src={city.image}
            alt={`${city.name}, ${city.country}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08161f]/85 via-transparent to-transparent" />

          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <Star className="size-3 fill-current" />
            {city.rating}
          </span>

          <div className="absolute inset-x-0 bottom-0 p-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/70">
              {city.region}
            </p>
            <h3 className="font-display text-lg font-semibold text-white">{city.name}</h3>
            <p className="text-xs text-white/80">{city.country}</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-4">
          <p className="text-xs text-muted">{city.description}</p>

          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="teal">{city.popularity}</Badge>
            <span className="text-xs text-muted">
              <span className="font-semibold text-fg">{'₹'.repeat(city.costIndex > 3 ? 3 : city.costIndex)}</span>
              <span className="text-muted/60">{'₹'.repeat(3 - (city.costIndex > 3 ? 3 : city.costIndex))}</span>
              {' · '}
              {city.currency}
            </span>
          </div>

          <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-3">
            <span className="flex items-center gap-1.5 text-xs text-muted">
              <Ticket className="size-3.5" />
              {city.activityCount} activities
            </span>

            <button
              type="button"
              onClick={() => onToggle(city.id)}
              aria-pressed={added}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors',
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
                  Add to trip
                </>
              )}
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default CityResultCard
