import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import { staggerItem } from '../utils/motionVariants'

export function DestinationCard({ destination }) {
  return (
    <motion.div variants={staggerItem} whileHover={{ y: -6 }} transition={{ duration: 0.25 }}>
      <Link
        to={`/search/cities?city=${destination.id}`}
        className="group relative block h-72 overflow-hidden rounded-2xl shadow-card sm:h-80"
      >
        <img
          src={destination.image}
          alt={`${destination.name}, ${destination.country}`}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08161f]/90 via-[#08161f]/25 to-transparent" />

        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
          <Star className="size-3 fill-current" />
          {destination.rating}
        </span>

        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/70">
            {destination.region}
          </p>
          <h3 className="mt-1 font-display text-xl font-semibold text-white">{destination.name}</h3>
          <p className="text-sm text-white/80">{destination.country}</p>
          <p className="mt-1.5 text-xs text-white/70">{destination.descriptor}</p>

          <span className="mt-3 inline-flex translate-y-1 items-center gap-1.5 rounded-full border border-white/40 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            Explore destination
          </span>
        </div>
      </Link>
    </motion.div>
  )
}

export default DestinationCard
