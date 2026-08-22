import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { ArrowRight, Compass, Search, X } from 'lucide-react'
import PageContainer from '../components/ui/PageContainer'
import SectionHeading from '../components/ui/SectionHeading'
import Input from '../components/ui/Input'
import Dropdown from '../components/ui/Dropdown'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import CityResultCard from '../components/search/CityResultCard'
import { staggerContainer } from '../utils/motionVariants'
import {
  citySortOptions,
  cityCostOptions,
  cityRegionOptions,
  searchableCities,
} from '../data/mockData'
import { cn } from '../utils/cn'

const costBand = { low: [1, 2], mid: [3, 3], high: [4, 5] }

function CitySearch() {
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState('all')
  const [cost, setCost] = useState('all')
  const [sortBy, setSortBy] = useState('popular')
  const [addedIds, setAddedIds] = useState([])

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase()
    let list = searchableCities

    if (needle) {
      list = list.filter((c) =>
        [c.name, c.country, c.region, c.description].some((f) => f.toLowerCase().includes(needle)),
      )
    }
    if (region !== 'all') list = list.filter((c) => c.region === region)
    if (cost !== 'all') {
      const [min, max] = costBand[cost]
      list = list.filter((c) => c.costIndex >= min && c.costIndex <= max)
    }

    const out = [...list]
    if (sortBy === 'name') return out.sort((a, b) => a.name.localeCompare(b.name))
    if (sortBy === 'activities') return out.sort((a, b) => b.activityCount - a.activityCount)
    if (sortBy === 'cost-low') return out.sort((a, b) => a.costIndex - b.costIndex)
    if (sortBy === 'cost-high') return out.sort((a, b) => b.costIndex - a.costIndex)
    return out.sort((a, b) => b.rating - a.rating)
  }, [query, region, cost, sortBy])

  const toggleCity = (id) =>
    setAddedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const clearFilters = () => {
    setQuery('')
    setRegion('all')
    setCost('all')
  }

  const filtersActive = query !== '' || region !== 'all' || cost !== 'all'

  return (
    <div className="pb-24">
      <PageContainer className="pt-10 sm:pt-14">
        <SectionHeading
          eyebrow="Explore"
          title="Search Cities"
          subtitle="Find your next stop, then add it straight to a trip."
        />

        <div className="mt-6 grid gap-3 lg:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))]">
          <Input
            icon={Search}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cities, countries, or regions…"
            aria-label="Search cities"
          />
          <Dropdown label="Region" options={cityRegionOptions} value={region} onChange={setRegion} />
          <Dropdown label="Budget" options={cityCostOptions} value={cost} onChange={setCost} />
          <Dropdown label="Sort" options={citySortOptions} value={sortBy} onChange={setSortBy} />
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted">
            <span className="font-semibold text-fg">{results.length}</span>{' '}
            {results.length === 1 ? 'city' : 'cities'} found
            {addedIds.length > 0 && (
              <>
                {' · '}
                <span className="font-semibold text-brand-600 dark:text-brand-400">
                  {addedIds.length} added
                </span>
              </>
            )}
          </p>

          <div className="flex items-center gap-2">
            {filtersActive && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:text-fg"
              >
                <X className="size-3.5" />
                Clear filters
              </button>
            )}
            {addedIds.length > 0 && (
              <Button to="/trips/create" size="sm" icon={ArrowRight} iconPosition="right">
                Continue with {addedIds.length}
              </Button>
            )}
          </div>
        </div>

        {results.length === 0 ? (
          <EmptyState
            icon={Compass}
            title="No cities match your search"
            description="Try a broader search term or clear your filters."
            action={
              <Button size="sm" variant="secondary" onClick={clearFilters}>
                Clear filters
              </Button>
            }
            className="mt-10"
          />
        ) : (
          <motion.div
            key={`${region}-${cost}-${sortBy}`}
            className={cn(
              'mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
            )}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {results.map((city) => (
              <CityResultCard
                key={city.id}
                city={city}
                added={addedIds.includes(city.id)}
                onToggle={toggleCity}
              />
            ))}
          </motion.div>
        )}
      </PageContainer>
    </div>
  )
}

export default CitySearch
