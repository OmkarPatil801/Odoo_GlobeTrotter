import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import SectionHeading from '../ui/SectionHeading'
import CityCard from './CityCard'
import { getPopularCities } from '../../services/cityService'
import { staggerContainer } from '../../utils/motionVariants'

export function DestinationsSection() {
  const [cities, setCities] = useState([])
  
  useEffect(() => {
    getPopularCities().then(res => setCities(res.data.data.cities || res.data.data)).catch(console.error)
  }, [])
  return (
    <section>
      <SectionHeading
        eyebrow="Get inspired"
        title="Places Worth Exploring"
        subtitle="Hand-picked cities loved by travelers around the world."
        actionLabel="View all"
        actionTo="/search/cities"
      />

      <motion.div
        className="mt-6 flex snap-x gap-5 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {cities.map((city) => (
          <div key={city.id} className="w-64 shrink-0 sm:w-auto">
            <CityCard city={city} />
          </div>
        ))}
      </motion.div>
    </section>
  )
}

export default DestinationsSection
