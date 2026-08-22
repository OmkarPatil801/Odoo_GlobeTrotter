import { motion } from 'motion/react'
import SectionHeading from '../ui/SectionHeading'
import EmptyState from '../ui/EmptyState'
import TripCard from './TripCard'
import { trips } from '../../data/mockData'
import { staggerContainer } from '../../utils/motionVariants'
import { Luggage } from 'lucide-react'

export function TripsSection() {
  return (
    <section>
      <SectionHeading
        eyebrow="Plan ahead"
        title="Your Journeys"
        subtitle="Pick up where you left off or check in on what's coming up."
        actionLabel="View all"
        actionTo="/trips"
      />

      {trips.length === 0 ? (
        <EmptyState
          icon={Luggage}
          title="No trips yet"
          description="Start planning your first adventure with GlobeTrotter."
          className="mt-6"
        />
      ) : (
        <motion.div
          className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </motion.div>
      )}
    </section>
  )
}

export default TripsSection
