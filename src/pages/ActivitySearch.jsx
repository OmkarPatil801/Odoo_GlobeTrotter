import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { ArrowRight, Search, Ticket, Wallet, X } from 'lucide-react'
import PageContainer from '../components/ui/PageContainer'
import SectionHeading from '../components/ui/SectionHeading'
import Input from '../components/ui/Input'
import Dropdown from '../components/ui/Dropdown'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import ActivityResultCard from '../components/search/ActivityResultCard'
import { formatCurrency } from '../utils/formatters'
import { staggerContainer } from '../utils/motionVariants'
import {
  activityCategoryOptions,
  activityDurationOptions,
  activitySortOptions,
  searchableActivities,
  searchableCities,
} from '../data/mockData'

const durationBand = { short: [0, 2.99], half: [3, 5], full: [5.01, 99] }

const cityOptions = [
  { value: 'all', label: 'All cities' },
  ...searchableCities.map((c) => ({ value: c.id, label: c.name })),
]

function ActivitySearch() {
  const [query, setQuery] = useState('')
  const [city, setCity] = useState('all')
  const [category, setCategory] = useState('all')
  const [duration, setDuration] = useState('all')
  const [sortBy, setSortBy] = useState('popular')
  const [addedIds, setAddedIds] = useState([])

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase()
    let list = searchableActivities

    if (needle) {
      list = list.filter((a) =>
        [a.name, a.city, a.country, a.category, a.description].some((f) =>
          f.toLowerCase().includes(needle),
        ),
      )
    }
    if (city !== 'all') list = list.filter((a) => a.cityId === city)
    if (category !== 'all') list = list.filter((a) => a.category === category)
    if (duration !== 'all') {
      const [min, max] = durationBand[duration]
      list = list.filter((a) => a.duration >= min && a.duration <= max)
    }

    const out = [...list]
    if (sortBy === 'name') return out.sort((a, b) => a.name.localeCompare(b.name))
    if (sortBy === 'cost-low') return out.sort((a, b) => a.cost - b.cost)
    if (sortBy === 'cost-high') return out.sort((a, b) => b.cost - a.cost)
    if (sortBy === 'duration') return out.sort((a, b) => a.duration - b.duration)
    return out.sort((a, b) => b.rating - a.rating)
  }, [query, city, category, duration, sortBy])

  const toggleActivity = (id) =>
    setAddedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const clearFilters = () => {
    setQuery('')
    setCity('all')
    setCategory('all')
    setDuration('all')
  }

  const filtersActive =
    query !== '' || city !== 'all' || category !== 'all' || duration !== 'all'

  const addedTotal = useMemo(
    () =>
      searchableActivities
        .filter((a) => addedIds.includes(a.id))
        .reduce((sum, a) => sum + a.cost, 0),
    [addedIds],
  )

  return (
    <div className="pb-24">
      <PageContainer className="pt-10 sm:pt-14">
        <SectionHeading
          eyebrow="Explore"
          title="Search Activities"
          subtitle="Find things to do, then add them to your itinerary."
        />

        <div className="mt-6 grid gap-3 lg:grid-cols-[minmax(0,2fr)_repeat(4,minmax(0,1fr))]">
          <Input
            icon={Search}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search activities, cities, or categories…"
            aria-label="Search activities"
          />
          <Dropdown label="City" options={cityOptions} value={city} onChange={setCity} />
          <Dropdown
            label="Category"
            options={activityCategoryOptions}
            value={category}
            onChange={setCategory}
          />
          <Dropdown
            label="Duration"
            options={activityDurationOptions}
            value={duration}
            onChange={setDuration}
          />
          <Dropdown label="Sort" options={activitySortOptions} value={sortBy} onChange={setSortBy} />
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted">
            <span className="font-semibold text-fg">{results.length}</span>{' '}
            {results.length === 1 ? 'activity' : 'activities'} found
            {addedIds.length > 0 && (
              <>
                {' · '}
                <span className="font-semibold text-brand-600 dark:text-brand-400">
                  {addedIds.length} added
                </span>
                <span className="inline-flex items-center gap-1 pl-2 text-muted">
                  <Wallet className="size-3.5" />
                  {formatCurrency(addedTotal)}
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
              <Button
                to="/trips/trip-1/itinerary"
                size="sm"
                icon={ArrowRight}
                iconPosition="right"
              >
                Add {addedIds.length} to itinerary
              </Button>
            )}
          </div>
        </div>

        {results.length === 0 ? (
          <EmptyState
            icon={Ticket}
            title="No activities match your search"
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
            key={`${city}-${category}-${duration}-${sortBy}`}
            className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {results.map((activity) => (
              <ActivityResultCard
                key={activity.id}
                activity={activity}
                added={addedIds.includes(activity.id)}
                onToggle={toggleActivity}
              />
            ))}
          </motion.div>
        )}
      </PageContainer>
    </div>
  )
}

export default ActivitySearch
