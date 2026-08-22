import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { Plus, Compass, Luggage, CalendarDays } from 'lucide-react'
import Card from '../ui/Card'
import { staggerContainer, staggerItem } from '../../utils/motionVariants'

const actions = [
  {
    title: 'Plan New Trip',
    description: 'Start building a fresh multi-city itinerary.',
    icon: Plus,
    to: '/trips/create',
  },
  {
    title: 'My Trips',
    description: 'Review and manage your saved journeys.',
    icon: Luggage,
    to: '/trips',
  },
  {
    title: 'Explore',
    description: 'Discover cities trending with travelers.',
    icon: Compass,
    to: '/search/cities',
  },
  {
    title: 'Calendar',
    description: 'See your travel timeline at a glance.',
    icon: CalendarDays,
    to: '/trips/trip-1/calendar',
  },
]

export function QuickActions() {
  return (
    <motion.div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {actions.map((action) => (
        <motion.div key={action.title} variants={staggerItem} whileHover={{ y: -4 }}>
          <Link to={action.to} className="block h-full">
            <Card className="flex h-full flex-col gap-3 p-5 transition-all hover:border-brand-500/40 hover:shadow-lift">
              <span className="flex size-10 items-center justify-center rounded-xl bg-brand-500/15 text-brand-600 dark:text-brand-400">
                <action.icon className="size-5" />
              </span>
              <div>
                <h3 className="font-display text-base font-semibold text-fg">{action.title}</h3>
                <p className="mt-1 text-sm text-muted">{action.description}</p>
              </div>
            </Card>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default QuickActions
