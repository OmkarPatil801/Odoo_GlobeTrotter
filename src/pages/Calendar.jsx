import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowLeft,
  BedDouble,
  CalendarDays,
  Camera,
  ChevronLeft,
  ChevronRight,
  List,
  MapPin,
  Plane,
  UtensilsCrossed,
} from 'lucide-react'
import PageContainer from '../components/ui/PageContainer'
import SectionHeading from '../components/ui/SectionHeading'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Dropdown from '../components/ui/Dropdown'
import EmptyState from '../components/ui/EmptyState'
import { formatCurrency, formatDate } from '../utils/formatters'
import { fadeSlideUp } from '../utils/motionVariants'
import { calendarEventTypes } from '../data/mockData'
import { getItinerary } from '../services/itineraryService'
import { calendarEvents as seedEvents, tripDetail as seedTripDetail } from '../data/mockData'
import { getTripById } from '../services/tripService'
import { cn } from '../utils/cn'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const typeMeta = {
  travel: { icon: Plane, dot: 'bg-sky-500', chip: 'bg-sky-500/15 text-sky-700 dark:text-sky-300' },
  hotel: { icon: BedDouble, dot: 'bg-teal-500', chip: 'bg-teal-500/15 text-teal-700 dark:text-teal-300' },
  activity: { icon: Camera, dot: 'bg-brand-500', chip: 'bg-brand-500/15 text-brand-600 dark:text-brand-300' },
  restaurant: { icon: UtensilsCrossed, dot: 'bg-amber-500', chip: 'bg-amber-500/15 text-amber-700 dark:text-amber-300' },
}

const toKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

function buildMonthGrid(year, month) {
  const first = new Date(year, month, 1)
  const offset = (first.getDay() + 6) % 7 // Monday-first
  const start = new Date(year, month, 1 - offset)

  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
    return { date, key: toKey(date), inMonth: date.getMonth() === month }
  })
}

function TripCalendar() {
  const { id } = useParams()
  const [tripDetail, setTripDetail] = useState(seedTripDetail)
  const [calendarEvents, setCalendarEvents] = useState(seedEvents)
  const [loading, setLoading] = useState(true)

  const [cursor, setCursor] = useState(() => {
    const start = new Date(seedTripDetail.startDate)
    return new Date(start.getFullYear(), start.getMonth(), 1)
  })
  const [view, setView] = useState('month')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedKey, setSelectedKey] = useState(seedTripDetail.startDate)

  useEffect(() => {
    Promise.all([
      getTripById(id),
      getItinerary(id)
    ]).then(([tripRes, itinRes]) => {
      const trip = tripRes.data.data.trip
      setTripDetail(trip)
      
      const tripStart = new Date(trip.startDate)
      setCursor(new Date(tripStart.getFullYear(), tripStart.getMonth(), 1))
      setSelectedKey(trip.startDate)
      
      const items = itinRes.data.data.itinerary || itinRes.data.data
      setCalendarEvents(items.map(item => ({
        id: item.id,
        title: item.title,
        date: item.startDate || item.date || trip.startDate,
        time: item.time || '10:00',
        type: item.type || 'activity',
        city: item.city || trip.stops?.[0]?.city?.name || 'City',
        cost: item.cost || item.budget || 0,
      })))
    })
      .catch(() => {
        // Backend offline (demo mode) — keep the seeded calendar.
      })
      .finally(() => setLoading(false))
  }, [id])

  const events = useMemo(
    () => (typeFilter === 'all' ? calendarEvents : calendarEvents.filter((e) => e.type === typeFilter)),
    [calendarEvents, typeFilter],
  )

  const eventsByDate = useMemo(() => {
    const map = new Map()
    events.forEach((e) => {
      if (!map.has(e.date)) map.set(e.date, [])
      map.get(e.date).push(e)
    })
    map.forEach((list) => list.sort((a, b) => a.time.localeCompare(b.time)))
    return map
  }, [events])

  const cells = useMemo(
    () => buildMonthGrid(cursor.getFullYear(), cursor.getMonth()),
    [cursor],
  )

  const selectedEvents = eventsByDate.get(selectedKey) ?? []
  const tripStartKey = tripDetail.startDate
  const tripEndKey = tripDetail.endDate

  const monthLabel = cursor.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })

  const shiftMonth = (delta) =>
    setCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1))

  const agendaDays = useMemo(
    () => [...eventsByDate.entries()].sort((a, b) => a[0].localeCompare(b[0])),
    [eventsByDate],
  )

  const totalCost = events.reduce((s, e) => s + e.cost, 0)

  if (loading || !tripDetail) return <div className="p-10 text-center text-white">Loading calendar...</div>

  return (
    <div className="pb-24">
      <PageContainer className="pt-10 sm:pt-14">
        <Button
          to={`/trips/${id}`}
          size="sm"
          variant="ghost"
          icon={ArrowLeft}
          className="mb-4 -ml-2"
        >
          Back to trip
        </Button>

        <motion.div initial="hidden" animate="visible" variants={fadeSlideUp}>
          <SectionHeading
            eyebrow={tripDetail.name}
            title="Trip Calendar"
            subtitle={`${events.length} plans · ${formatCurrency(totalCost)} across ${agendaDays.length} days`}
          />
        </motion.div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              aria-label="Previous month"
              className="flex size-9 items-center justify-center rounded-full border border-line bg-card text-muted transition-colors hover:text-fg"
            >
              <ChevronLeft className="size-4" />
            </button>
            <p className="min-w-44 text-center font-display text-lg font-semibold text-fg">
              {monthLabel}
            </p>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              aria-label="Next month"
              className="flex size-9 items-center justify-center rounded-full border border-line bg-card text-muted transition-colors hover:text-fg"
            >
              <ChevronRight className="size-4" />
            </button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                const tripStart = new Date(tripDetail.startDate)
                setCursor(new Date(tripStart.getFullYear(), tripStart.getMonth(), 1))
              }}
            >
              Trip month
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Dropdown
              label="Type"
              options={calendarEventTypes}
              value={typeFilter}
              onChange={setTypeFilter}
              className="min-w-44"
            />
            <div className="flex items-center gap-1 rounded-full border border-line bg-card p-1">
              {[
                ['month', CalendarDays, 'Month'],
                ['agenda', List, 'Agenda'],
              ].map(([value, Icon, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setView(value)}
                  className={cn(
                    'relative inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                    view === value ? 'text-white' : 'text-muted hover:text-fg',
                  )}
                >
                  {view === value && (
                    <motion.span
                      layoutId="cal-view"
                      className="absolute inset-0 rounded-full bg-brand-500"
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                  <span className="relative flex items-center gap-1.5">
                    <Icon className="size-3.5" />
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {view === 'month' ? (
            <motion.div
              key="month"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]"
            >
              <Card className="overflow-hidden">
                <div className="grid grid-cols-7 border-b border-line bg-surface-alt">
                  {WEEKDAYS.map((d) => (
                    <div
                      key={d}
                      className="px-2 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-muted"
                    >
                      {d}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7">
                  {cells.map((cell, i) => {
                    const dayEvents = eventsByDate.get(cell.key) ?? []
                    const inTrip = cell.key >= tripStartKey && cell.key <= tripEndKey
                    const selected = cell.key === selectedKey

                    return (
                      <button
                        key={cell.key}
                        type="button"
                        onClick={() => setSelectedKey(cell.key)}
                        className={cn(
                          'relative flex min-h-24 flex-col gap-1 border-line p-2 text-left transition-colors',
                          i % 7 !== 6 && 'border-r',
                          i < 35 && 'border-b',
                          !cell.inMonth && 'opacity-40',
                          inTrip ? 'bg-brand-500/[0.06]' : 'hover:bg-surface-alt',
                          selected && 'ring-2 ring-inset ring-brand-500',
                        )}
                      >
                        <span
                          className={cn(
                            'text-xs font-semibold',
                            selected ? 'text-brand-600 dark:text-brand-400' : 'text-fg',
                          )}
                        >
                          {cell.date.getDate()}
                        </span>

                        <span className="flex flex-col gap-1">
                          {dayEvents.slice(0, 2).map((e) => (
                            <span
                              key={e.id}
                              className={cn(
                                'truncate rounded px-1.5 py-0.5 text-[10px] font-medium',
                                typeMeta[e.type].chip,
                              )}
                            >
                              {e.time} {e.title}
                            </span>
                          ))}
                          {dayEvents.length > 2 && (
                            <span className="pl-1 text-[10px] text-muted">
                              +{dayEvents.length - 2} more
                            </span>
                          )}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </Card>

              <Card className="flex flex-col p-5 lg:sticky lg:top-24 lg:self-start">
                <h3 className="font-display text-base font-semibold text-fg">
                  {formatDate(selectedKey)}
                </h3>
                <p className="mt-0.5 text-xs text-muted">
                  {selectedEvents.length} plan{selectedEvents.length === 1 ? '' : 's'}
                </p>

                {selectedEvents.length === 0 ? (
                  <p className="mt-6 text-sm text-muted">Nothing scheduled for this day.</p>
                ) : (
                  <ul className="mt-4 flex flex-col gap-3">
                    {selectedEvents.map((e) => {
                      const Icon = typeMeta[e.type].icon
                      return (
                        <li key={e.id} className="flex gap-3">
                          <span
                            className={cn(
                              'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full',
                              typeMeta[e.type].chip,
                            )}
                          >
                            <Icon className="size-4" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-fg">{e.title}</p>
                            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
                              {e.time}
                              <MapPin className="size-3" />
                              {e.city}
                            </p>
                          </div>
                          <span className="shrink-0 text-xs font-semibold text-fg">
                            {formatCurrency(e.cost)}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                )}

                <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-4">
                  {Object.entries(typeMeta).map(([type, meta]) => (
                    <span key={type} className="flex items-center gap-1.5 text-xs text-muted">
                      <span className={cn('size-2 rounded-full', meta.dot)} />
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </span>
                  ))}
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="agenda"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="mt-5 flex flex-col gap-4"
            >
              {agendaDays.length === 0 ? (
                <EmptyState
                  icon={CalendarDays}
                  title="No plans match this filter"
                  description="Try a different event type."
                />
              ) : (
                agendaDays.map(([date, dayEvents]) => (
                  <Card key={date} className="overflow-hidden">
                    <div className="flex items-center justify-between gap-3 border-b border-line bg-surface-alt px-5 py-3">
                      <p className="font-display text-sm font-semibold text-fg">
                        {formatDate(date)}
                      </p>
                      <Badge tone="neutral">
                        {dayEvents.length} plan{dayEvents.length === 1 ? '' : 's'}
                      </Badge>
                    </div>

                    <ul className="flex flex-col">
                      {dayEvents.map((e, i) => {
                        const Icon = typeMeta[e.type].icon
                        return (
                          <li
                            key={e.id}
                            className={cn(
                              'flex items-center gap-4 px-5 py-3.5',
                              i > 0 && 'border-t border-line',
                            )}
                          >
                            <span className="w-12 shrink-0 text-xs font-semibold text-muted">
                              {e.time}
                            </span>
                            <span
                              className={cn(
                                'flex size-8 shrink-0 items-center justify-center rounded-full',
                                typeMeta[e.type].chip,
                              )}
                            >
                              <Icon className="size-4" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-fg">{e.title}</p>
                              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                                <MapPin className="size-3" />
                                {e.city}
                              </p>
                            </div>
                            <span className="shrink-0 text-sm font-semibold text-fg">
                              {formatCurrency(e.cost)}
                            </span>
                          </li>
                        )
                      })}
                    </ul>
                  </Card>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </PageContainer>
    </div>
  )
}

export default TripCalendar
