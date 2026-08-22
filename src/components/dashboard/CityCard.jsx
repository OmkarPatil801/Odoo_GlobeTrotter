import { motion } from 'motion/react'
import { IndianRupee, ArrowUpRight } from 'lucide-react'
import { staggerItem } from '../../utils/motionVariants'

export function CityCard({ city }) {
  return (
    <motion.div
      variants={staggerItem}
      className="group relative h-72 shrink-0 snap-start overflow-hidden rounded-2xl border border-white/10 shadow-card sm:h-80"
    >
      <img
        src={city.image}
        alt={`${city.name}, ${city.country}`}
        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#08161f] via-[#08161f]/40 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5">
        <div>
          <h3 className="font-display text-xl font-semibold text-white">{city.name}</h3>
          <p className="text-sm text-white/80">{city.country}</p>
          {city.description && (
            <p className="mt-1 text-xs text-white/70 line-clamp-1">{city.description}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-white/80">
            <IndianRupee className="size-3" />
            {'●'.repeat(city.costIndex)}
            <span className="text-white/40">{'●'.repeat(5 - city.costIndex)}</span>
          </div>
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
            {city.popularity}
          </span>
        </div>

        <button
          type="button"
          className="mt-1 flex items-center justify-center gap-1.5 rounded-full border border-white/15 bg-white/5 py-2 text-sm font-medium text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 hover:bg-white/15"
        >
          Explore
          <ArrowUpRight className="size-3.5" />
        </button>
      </div>
    </motion.div>
  )
}

export default CityCard
