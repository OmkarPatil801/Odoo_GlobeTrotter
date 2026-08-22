import { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { Luggage, Plus, Wallet, CalendarRange } from 'lucide-react'
import PageContainer from '../components/ui/PageContainer'
import SectionHeading from '../components/ui/SectionHeading'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import SearchControls from '../components/SearchControls'
import MyTripCard from '../components/trips/MyTripCard'
import { formatCurrency } from '../utils/formatters'
import { fadeSlideUp, staggerContainer } from '../utils/motionVariants'
import {
  myTrips as mockMyTrips,
  tripGroupByOptions,
  tripSortOptions,
  tripStatusTabs,
} from '../data/mockData'
import { getTrips } from '../services/tripService'
import { cn } from '../utils/cn'

function sortTrips(list, sortBy) {
  const out = [...list]
  if (sortBy === 'name') return out.sort((a, b) => a.name.localeCompare(b.name))
  if (sortBy === 'budget-high') return out.sort((a, b) => b.totalBudget - a.totalBudget)
  if (sortBy === 'budget-low') return out.sort((a, b) => a.totalBudget - b.totalBudget)
  if (sortBy === 'date-asc')
    return out.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
  return out.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
}

function groupTrips(list, groupBy) {
  if (groupBy === 'none') return [{ key: 'all', items: list }]

  const buckets = new Map()
  list.forEach((trip) => {
    const key =
      groupBy === 'year'
        ? String(new Date(trip.startDate).getFullYear())
        : trip.status.charAt(0).toUpperCase() + trip.status.slice(1)
    if (!buckets.has(key)) buckets.set(key, [])
    buckets.get(key).push(trip)
  })
  return [...buckets.entries()].map(([key, items]) => ({ key, items }))
}

function MyTrips() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [groupBy, setGroupBy] = useState('none')
  const [sortBy, setSortBy] = useState('date-desc')
  const [myTrips, setMyTrips] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTrips()
      .then((res) => {
        setMyTrips(res.data.data.trips)
      })
      .catch(() => setMyTrips(mockMyTrips))
      .finally(() => setLoading(false))
  }, [])

  const groups = useMemo(() => {
    const needle = query.trim().toLowerCase()
    let list = myTrips

    if (status !== 'all') list = list.filter((t) => t.status === status)
    if (needle) {
      list = list.filter((t) =>
        [t.name, ...t.destinations].some((f) => f.toLowerCase().includes(needle)),
      )
    }

    return groupTrips(sortTrips(list, sortBy), groupBy)
  }, [myTrips, query, status, sortBy, groupBy])

  const resultCount = groups.reduce((n, g) => n + g.items.length, 0)

  const stats = useMemo(() => {
    const planned = myTrips.reduce((s, t) => s + t.totalBudget, 0)
    const upcoming = myTrips.filter((t) => t.status === 'upcoming').length
    return [
      { label: 'Total trips', value: myTrips.length, icon: Luggage },
      { label: 'Upcoming', value: upcoming, icon: CalendarRange },
      { label: 'Total planned', value: formatCurrency(planned), icon: Wallet },
    ]
  }, [myTrips])

  return (
    <div className="pb-24">
      <PageContainer className="pt-10 sm:pt-14">
        <motion.div initial="hidden" animate="visible" variants={fadeSlideUp}>
          <SectionHeading
            eyebrow="Your library"
            title="My Trips"
            subtitle="Every journey you've planned, in one place."
          />
        </motion.div>

        <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <motion.div
            className="grid flex-1 gap-4 sm:grid-cols-3"
            initial="hidden"
            animate="visible"
            variants={fadeSlideUp}
          >
            {stats.map((stat) => (
              <Card key={stat.label} className="flex items-center gap-3.5 p-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/15 text-brand-600 dark:text-brand-400">
                  <stat.icon className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wide text-muted">{stat.label}</p>
                  <p className="mt-0.5 truncate font-display text-lg font-semibold text-fg">
                    {stat.value}
                  </p>
                </div>
              </Card>
            ))}
          </motion.div>

          <Button to="/trips/create" icon={Plus} className="shrink-0">
            Plan a Trip
          </Button>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          {tripStatusTabs.map((tab) => {
            const active = status === tab.value
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setStatus(tab.value)}
                className={cn(
                  'relative rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  active ? 'text-white' : 'text-muted hover:text-fg',
                )}
              >
                {active && (
                  <motion.span
                    layoutId="trip-tab"
                    className="absolute inset-0 rounded-full bg-brand-500"
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
                <span className="relative">{tab.label}</span>
              </button>
            )
          })}
        </div>

        <SearchControls
          className="mt-4"
          query={query}
          onQueryChange={setQuery}
          placeholder="Search trips or destinations…"
          groupBy={groupBy}
          onGroupByChange={setGroupBy}
          groupByOptions={tripGroupByOptions}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortByOptions={tripSortOptions}
        />

        {resultCount === 0 ? (
          <EmptyState
            icon={Luggage}
            title="No trips found"
            description="Try a different search, or start planning something new."
            action={
              <Button to="/trips/create" size="sm" icon={Plus}>
                Plan a Trip
              </Button>
            }
            className="mt-10"
          />
        ) : (
          <div className="mt-8 flex flex-col gap-10">
            {groups.map((group) => (
              <div key={group.key}>
                {groupBy !== 'none' && (
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-muted">
                    {group.key}
                    <span className="ml-2 text-muted/70">({group.items.length})</span>
                  </h3>
                )}

                <motion.div
                  className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  {group.items.map((trip) => (
                    <MyTripCard key={trip.id} trip={trip} />
                  ))}
                </motion.div>
              </div>
            ))}
          </div>
        )}
      </PageContainer>
    </div>
  )
}

export default MyTrips
