import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { Compass, Plus } from 'lucide-react'
import Button from '../components/ui/Button'
import PageContainer from '../components/ui/PageContainer'
import SectionHeading from '../components/ui/SectionHeading'
import EmptyState from '../components/ui/EmptyState'
import SearchControls from '../components/SearchControls'
import DestinationCard from '../components/DestinationCard'
import PreviousTripCard from '../components/PreviousTripCard'
import LandingHero from '../components/landing/LandingHero'
import PlanTripCTA from '../components/landing/PlanTripCTA'
import TravelGlobe from '../components/TravelGlobe'
import { staggerContainer } from '../utils/motionVariants'
import {
  destinationFilterOptions,
  destinationGroupByOptions,
  destinationSortOptions,
  previousTrips,
  regionalDestinations,
} from '../data/mockData'

function applyFilter(list, filter) {
  if (filter === 'budget') return list.filter((item) => item.costIndex <= 3)
  if (filter === 'premium') return list.filter((item) => item.costIndex >= 4)
  return list
}

function applySort(list, sortBy) {
  const sorted = [...list]
  if (sortBy === 'name') return sorted.sort((a, b) => a.name.localeCompare(b.name))
  if (sortBy === 'cost-low') return sorted.sort((a, b) => a.costIndex - b.costIndex)
  if (sortBy === 'cost-high') return sorted.sort((a, b) => b.costIndex - a.costIndex)
  return sorted.sort((a, b) => b.rating - a.rating)
}

function groupDestinations(list, groupBy) {
  if (groupBy === 'none') return [{ key: 'all', items: list }]

  const buckets = new Map()
  list.forEach((item) => {
    const key = item[groupBy]
    if (!buckets.has(key)) buckets.set(key, [])
    buckets.get(key).push(item)
  })

  return [...buckets.entries()].map(([key, items]) => ({ key, items }))
}

function Landing() {
  const [query, setQuery] = useState('')
  const [groupBy, setGroupBy] = useState('none')
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('popular')

  const groups = useMemo(() => {
    const needle = query.trim().toLowerCase()

    const searched = needle
      ? regionalDestinations.filter((item) =>
          [item.name, item.country, item.region, item.descriptor].some((field) =>
            field.toLowerCase().includes(needle),
          ),
        )
      : regionalDestinations

    return groupDestinations(applySort(applyFilter(searched, filter), sortBy), groupBy)
  }, [query, filter, sortBy, groupBy])

  const resultCount = groups.reduce((total, group) => total + group.items.length, 0)

  return (
    <div className="pb-24">
      <LandingHero>
        <SearchControls
          query={query}
          onQueryChange={setQuery}
          placeholder="Search destinations, cities, or regions…"
          groupBy={groupBy}
          onGroupByChange={setGroupBy}
          groupByOptions={destinationGroupByOptions}
          filter={filter}
          onFilterChange={setFilter}
          filterOptions={destinationFilterOptions}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortByOptions={destinationSortOptions}
        />
      </LandingHero>

      <PageContainer className="flex flex-col gap-16 pt-16 sm:gap-20">
        <section className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
              Live destination map
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold leading-tight text-fg sm:text-4xl">
              Explore destinations around the world.
            </h2>
            <p className="mt-4 max-w-md text-base text-muted">
              Spin the globe, tap a glowing marker, and follow the flight paths connecting the
              cities GlobeTrotter travelers are booking right now.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button to="/trips/create" size="lg" icon={Plus}>
                Start planning
              </Button>
              <Button to="/search/cities" size="lg" variant="outline">
                Browse destinations
              </Button>
            </div>
          </div>
          <TravelGlobe className="mx-auto w-full max-w-md lg:max-w-none" />
        </section>

        <section>
          <SectionHeading
            eyebrow="Handpicked for you"
            title="Top Regional Selections"
            subtitle="Destinations travelers are loving right now."
            actionLabel="View all"
            actionTo="/search/cities"
          />

          {resultCount === 0 ? (
            <EmptyState
              icon={Compass}
              title="No destinations found"
              description="Try a different search term or clear your filters."
              className="mt-6"
            />
          ) : (
            <div className="mt-6 flex flex-col gap-8">
              {groups.map((group) => (
                <div key={group.key}>
                  {groupBy !== 'none' && (
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-muted">
                      {group.key}
                    </h3>
                  )}

                  <motion.div
                    className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                  >
                    {group.items.map((destination) => (
                      <DestinationCard key={destination.id} destination={destination} />
                    ))}
                  </motion.div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <SectionHeading
            eyebrow="Your history"
            title="Previous Trips"
            subtitle="Revisit the journeys you've already mapped out."
            actionLabel="View all"
            actionTo="/trips"
          />

          <motion.div
            className="mt-6 flex snap-x gap-5 overflow-x-auto pb-2 no-scrollbar md:grid md:grid-cols-2 md:overflow-visible xl:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {previousTrips.map((trip) => (
              <div key={trip.id} className="w-80 shrink-0 snap-start md:w-auto">
                <PreviousTripCard trip={trip} />
              </div>
            ))}
          </motion.div>
        </section>

        <PlanTripCTA />
      </PageContainer>
    </div>
  )
}

export default Landing
