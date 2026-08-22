import { motion } from 'motion/react'
import { Compass } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { fadeSlideUp } from '../../utils/motionVariants'

export function CTASection() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={fadeSlideUp}
    >
      <Card className="relative overflow-hidden px-6 py-12 text-center sm:px-12 sm:py-16">
        <div className="pointer-events-none absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-brand-500/20 blur-3xl" />

        <div className="relative">
          <span className="mx-auto mb-4 flex size-11 items-center justify-center rounded-full bg-brand-500/15 text-brand-600 dark:text-brand-400">
            <Compass className="size-5" />
          </span>
          <h2 className="font-display text-2xl font-semibold text-fg sm:text-3xl">
            Ready to plan your next adventure?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            Turn your next idea into a fully planned, budgeted itinerary in minutes.
          </p>
          <Button to="/trips/create" size="lg" className="mt-6">
            Create My Trip
          </Button>
        </div>
      </Card>
    </motion.section>
  )
}

export default CTASection
