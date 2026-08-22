import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  CalendarDays,
  Check,
  Copy,
  Globe,
  Lock,
  MapPin,
  Pencil,
  Users,
  Wallet,
} from 'lucide-react'
import PageContainer from '../components/ui/PageContainer'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import ItineraryDay from '../components/itinerary/ItineraryDay'
import { formatCurrency, formatDateRange } from '../utils/formatters'
import { fadeSlideUp, staggerContainer } from '../utils/motionVariants'
import { getTripById } from '../services/tripService'

function TripDetails() {
  const { id } = useParams()
  const [tripDetail, setTripDetail] = useState(null)
  const [itineraryDays, setItineraryDays] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [isPublic, setIsPublic] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // In a real app, you would fetch itinerary along with the trip or separately.
    // Assuming backend returns itinerary inside trip or we fetch it.
    getTripById(id)
      .then((res) => {
        const trip = res.data.data.trip
        setTripDetail(trip)
        setIsPublic(trip.isShared || false)
        // If itinerary is part of the response or we just mock it for now until we update the itinerary component
        setItineraryDays(trip.itineraryDays || []) 
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const totals = useMemo(() => {
    if (!tripDetail) return { days: 0, activities: 0, cost: 0 }
    const items = itineraryDays.flatMap((day) => day.items || [])
    return {
      days: itineraryDays.length,
      activities: items.length,
      cost: items.reduce((sum, item) => sum + (item.cost || 0), 0),
    }
  }, [itineraryDays, tripDetail])

  if (loading) return <div className="p-10 text-center text-white">Loading trip...</div>
  if (error || !tripDetail) return <div className="p-10 text-center text-red-500">Error loading trip: {error}</div>

  const planned = tripDetail.budget?.planned || 0
  const spent = tripDetail.budget?.spent || 0
  const remaining = planned - spent
  const spentPercent = planned > 0 ? Math.round((spent / planned) * 100) : 0

  const handleCopyLink = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="pb-24">
      <section className="relative h-72 overflow-hidden lg:h-80">
        <img
          src={tripDetail.coverImage}
          alt={tripDetail.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06131c]/92 via-[#06131c]/55 to-[#06131c]/25" />

        <PageContainer className="relative flex h-full flex-col justify-end pb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="brand">Upcoming</Badge>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                {isPublic ? <Globe className="size-3" /> : <Lock className="size-3" />}
                {isPublic ? 'Public itinerary' : 'Private'}
              </span>
            </div>

            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white lg:text-4xl">
              {tripDetail.name}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-white/80">{tripDetail.summary}</p>

            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/85">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="size-4" />
                {formatDateRange(tripDetail.startDate, tripDetail.endDate)}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4" />
                {tripDetail.stops?.map((s) => s.city?.name || s.city).join(' • ') || 'No stops yet'}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="size-4" />
                {tripDetail.travellers || 1} travellers
              </span>
            </div>
          </motion.div>
        </PageContainer>
      </section>

      <PageContainer className="pt-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] xl:gap-10">
          <div>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
                  Day by day
                </p>
                <h2 className="mt-1 font-display text-2xl font-semibold text-fg">Your Itinerary</h2>
              </div>
              <Button to={`/trips/${tripDetail.id}/itinerary`} size="sm" variant="secondary" icon={Pencil}>
                Edit
              </Button>
            </div>

            <motion.div
              className="mt-6 flex flex-col gap-5"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {itineraryDays.map((day) => (
                <ItineraryDay key={day.id} day={day} />
              ))}
            </motion.div>
          </div>

          <motion.aside
            className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start"
            initial="hidden"
            animate="visible"
            variants={fadeSlideUp}
          >
            <Card className="p-5">
              <h3 className="font-display text-base font-semibold text-fg">Trip overview</h3>
              <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
                {[
                  ['Days', totals.days],
                  ['Stops', tripDetail.stops?.length || 0],
                  ['Plans', totals.activities],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-surface-alt py-3">
                    <dt className="text-xs text-muted">{label}</dt>
                    <dd className="mt-0.5 font-display text-lg font-semibold text-fg">{value}</dd>
                  </div>
                ))}
              </dl>
            </Card>

            <Card className="p-5">
              <div className="flex items-center gap-2">
                <Wallet className="size-4 text-brand-500" />
                <h3 className="font-display text-base font-semibold text-fg">Budget</h3>
              </div>

              <p className="mt-3 font-display text-2xl font-semibold text-fg">
                {formatCurrency(planned)}
              </p>
              <p className="text-xs text-muted">planned</p>

              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-surface-alt">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600"
                  style={{ width: `${spentPercent}%` }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-muted">
                  Spent <span className="font-semibold text-fg">{formatCurrency(spent)}</span>
                </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(remaining)} left
                </span>
              </div>

              <Button
                to={`/trips/${tripDetail.id}/budget`}
                size="sm"
                variant="secondary"
                className="mt-4 w-full"
              >
                View breakdown
              </Button>
            </Card>

            <Card className="p-5">
              <h3 className="font-display text-base font-semibold text-fg">Stops</h3>
              <ul className="mt-3 flex flex-col gap-2.5">
                {tripDetail.stops?.map((stop, i) => (
                  <li key={stop.id || i} className="flex items-center gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-500/15 text-xs font-semibold text-brand-600 dark:text-brand-400">
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-fg">{stop.city?.name || stop.city}</span>
                      <span className="block truncate text-xs text-muted">{stop.city?.country || stop.country}</span>
                    </span>
                    <span className="shrink-0 text-xs text-muted">{stop.nights}n</span>
                  </li>
                )) || <li className="text-sm text-muted">No stops added.</li>}
              </ul>
            </Card>

            <Card className="p-5">
              <h3 className="font-display text-base font-semibold text-fg">Sharing</h3>
              <p className="mt-1 text-xs text-muted">
                {isPublic ? 'Anyone with the link can view this trip.' : 'Only you can see this trip.'}
              </p>

              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPublic((prev) => !prev)}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-line bg-card px-3 py-2 text-xs font-medium text-fg transition-colors hover:border-brand-500/50"
                >
                  {isPublic ? <Lock className="size-3.5" /> : <Globe className="size-3.5" />}
                  {isPublic ? 'Make private' : 'Make public'}
                </button>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-line bg-card px-3 py-2 text-xs font-medium text-fg transition-colors hover:border-brand-500/50"
                >
                  {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                  {copied ? 'Copied' : 'Copy link'}
                </button>
              </div>
            </Card>

            <Button to={`/trips/${tripDetail.id}/calendar`} variant="secondary" className="w-full">
              View calendar
            </Button>
          </motion.aside>
        </div>
      </PageContainer>
    </div>
  )
}

export default TripDetails
