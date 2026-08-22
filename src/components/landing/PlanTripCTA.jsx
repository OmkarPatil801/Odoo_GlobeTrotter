import { motion } from 'motion/react'
import { Plus } from 'lucide-react'
import Button from '../ui/Button'
import { fadeSlideUp } from '../../utils/motionVariants'

export function PlanTripCTA() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={fadeSlideUp}
    >
      <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center sm:px-12 sm:py-16">
        <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-brand-500/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 size-64 rounded-full bg-teal-500/20 blur-3xl" />

        <div className="relative">
          <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
            Ready to plan your next adventure?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-white/75 sm:text-base">
            Build a multi-city itinerary, set a budget, and keep every booking in one place.
          </p>

          <Button to="/trips/create" size="lg" icon={Plus} className="mt-8">
            Plan a Trip
          </Button>
        </div>
      </div>
    </motion.section>
  )
}

export default PlanTripCTA
