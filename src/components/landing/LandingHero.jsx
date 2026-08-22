import { motion } from 'motion/react'
import { Plus } from 'lucide-react'
import Button from '../ui/Button'
import { landingHeroImage } from '../../data/mockData'

export function LandingHero({ children }) {
  return (
    <section className="relative">
      <div className="relative min-h-[32rem] overflow-hidden sm:min-h-[36rem] lg:min-h-[40rem]">
        <img
          src={landingHeroImage}
          alt="Whitewashed clifftop village overlooking the sea"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#06131c]/70 via-[#06131c]/45 to-[#06131c]/85" />

        <div className="relative mx-auto flex min-h-[32rem] max-w-7xl flex-col justify-center px-4 py-20 sm:min-h-[36rem] sm:px-6 lg:min-h-[40rem] lg:px-8">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Explore the world.
              <span className="block text-white/85">Plan the journey you’ll remember.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base text-white/80 sm:text-lg">
              Discover destinations, build personalized itineraries, and keep every part of your
              journey organized.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button to="/trips/create" size="lg" icon={Plus}>
                Plan a Trip
              </Button>
              <Button to="/search/cities" size="lg" variant="outline">
                Explore Destinations
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {children && (
        <motion.div
          className="mx-auto -mt-10 max-w-7xl px-4 sm:px-6 lg:-mt-12 lg:px-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
        >
          <div className="rounded-2xl border border-line bg-card p-4 shadow-lift sm:p-5">
            {children}
          </div>
        </motion.div>
      )}
    </section>
  )
}

export default LandingHero
