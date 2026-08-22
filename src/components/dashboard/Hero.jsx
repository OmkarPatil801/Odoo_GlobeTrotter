import { useRef } from 'react'
import { motion } from 'motion/react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Compass, Plus } from 'lucide-react'
import Button from '../ui/Button'
import TravelGlobe from '../TravelGlobe'

export function Hero() {
  const orbRefA = useRef(null)
  const orbRefB = useRef(null)
  const scope = useRef(null)

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReducedMotion) return

      gsap.to(orbRefA.current, {
        x: 40,
        y: -30,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
      gsap.to(orbRefB.current, {
        x: -30,
        y: 25,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    },
    { scope },
  )

  return (
    <section ref={scope} className="relative overflow-hidden">
      <div
        ref={orbRefA}
        className="pointer-events-none absolute -left-24 top-10 size-72 rounded-full bg-brand-500/20 blur-3xl"
      />
      <div
        ref={orbRefB}
        className="pointer-events-none absolute -right-16 top-40 size-80 rounded-full bg-sky-500/10 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center md:py-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1 text-xs font-medium text-brand-600 dark:text-brand-400">
            <Compass className="size-3.5" />
            Plan smarter, travel further
          </span>

          <h1 className="mt-5 font-display text-4xl font-semibold uppercase leading-[1.05] tracking-tight text-fg sm:text-5xl">
            Where will you go next?
          </h1>

          <p className="mt-5 max-w-md text-base text-muted">
            Plan unforgettable journeys, one destination at a time. Build multi-city
            itineraries, track budgets, and bring every trip to life.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button to="/trips/create" size="lg" icon={Plus}>
              Plan New Trip
            </Button>
            <Button to="/search/cities" size="lg" variant="secondary">
              Explore Destinations
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          <TravelGlobe className="mx-auto w-full max-w-md md:max-w-none" />
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
