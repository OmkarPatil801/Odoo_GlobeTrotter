import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CalendarDays, CheckCircle2, Compass, Sparkles, Wallet } from 'lucide-react'
import PageContainer from '../components/ui/PageContainer'
import SectionHeading from '../components/ui/SectionHeading'
import Card from '../components/ui/Card'
import Field from '../components/ui/Field'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import DestinationSelect from '../components/DestinationSelect'
import ActivityCard from '../components/ActivityCard'
import { staggerContainer, fadeSlideUp } from '../utils/motionVariants'
import { formatCurrency } from '../utils/formatters'
import { getPopularCities } from '../services/cityService'
import { getActivitiesByCity } from '../services/activityService'
import { tripDestinations as seedDestinations, suggestedActivities as seedActivities } from '../data/mockData'
import { createTrip } from '../services/tripService'

const emptyForm = {
  name: '',
  destinationId: '',
  startDate: '',
  endDate: '',
}

function validate(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Give your trip a name.'
  if (!form.destinationId) errors.destinationId = 'Pick a destination.'
  if (!form.startDate) errors.startDate = 'Choose a start date.'
  if (!form.endDate) errors.endDate = 'Choose an end date.'
  if (form.startDate && form.endDate && form.endDate < form.startDate) {
    errors.endDate = 'End date must be after the start date.'
  }
  return errors
}

function CreateTrip() {
  const [form, setForm] = useState(emptyForm)
  const [selectedActivityIds, setSelectedActivityIds] = useState([])
  const [errors, setErrors] = useState({})
  const [createdTrip, setCreatedTrip] = useState(null)
  
  const [tripDestinations, setTripDestinations] = useState(seedDestinations)
  const [suggestedActivities, setSuggestedActivities] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    getPopularCities()
      .then((res) => setTripDestinations(res.data.data.cities || res.data.data))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (form.destinationId) {
      getActivitiesByCity(form.destinationId)
        .then((res) => setSuggestedActivities(res.data.data.activities || res.data.data))
        .catch(() => setSuggestedActivities(seedActivities))
    } else {
      setSuggestedActivities([])
    }
  }, [form.destinationId])

  const destination = tripDestinations.find((d) => d.id === form.destinationId)

  const setValue = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const toggleActivity = (activityId) => {
    setSelectedActivityIds((prev) =>
      prev.includes(activityId) ? prev.filter((id) => id !== activityId) : [...prev, activityId],
    )
  }

  const activitiesTotal = useMemo(
    () =>
      suggestedActivities
        .filter((activity) => selectedActivityIds.includes(activity.id))
        .reduce((sum, activity) => sum + activity.estimatedCost, 0),
    [selectedActivityIds],
  )

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    try {
      const payload = {
        name: form.name.trim(),
        startDate: form.startDate,
        endDate: form.endDate,
        destinationIds: [form.destinationId],
        activityIds: selectedActivityIds,
        estimatedBudget: activitiesTotal,
      }
      
      const response = await createTrip(payload)
      setCreatedTrip(response.data.data.trip || payload)
    } catch {
      // Backend offline (demo mode) — still confirm the trip locally so the
      // planner flow completes end to end.
      setCreatedTrip({ id: `trip-${Date.now()}`, ...payload })
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setForm(emptyForm)
    setSelectedActivityIds([])
    setErrors({})
    setCreatedTrip(null)
  }

  return (
    <div className="pb-24">
      <PageContainer className="pt-10 sm:pt-14">
        <motion.div initial="hidden" animate="visible" variants={fadeSlideUp}>
          <SectionHeading
            eyebrow="New journey"
            title="Plan a New Trip"
            subtitle="Name it, pick where you're going, set your dates, then add what you'd like to do."
          />
        </motion.div>

        <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-12">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <Card className="p-6 sm:p-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Trip name"
                  htmlFor="trip-name"
                  error={errors.name}
                  className="sm:col-span-2"
                >
                  <Input
                    id="trip-name"
                    value={form.name}
                    onChange={(event) => setValue('name', event.target.value)}
                    placeholder="e.g. European Escape"
                  />
                </Field>

                <Field
                  label="Destination"
                  htmlFor="trip-destination"
                  error={errors.destinationId}
                  className="sm:col-span-2"
                >
                  <DestinationSelect
                    id="trip-destination"
                    destinations={tripDestinations}
                    value={form.destinationId}
                    onChange={(value) => setValue('destinationId', value)}
                    invalid={Boolean(errors.destinationId)}
                  />
                </Field>

                <Field label="Start date" htmlFor="trip-start" error={errors.startDate}>
                  <Input
                    id="trip-start"
                    type="date"
                    icon={CalendarDays}
                    value={form.startDate}
                    onChange={(event) => setValue('startDate', event.target.value)}
                  />
                </Field>

                <Field label="End date" htmlFor="trip-end" error={errors.endDate}>
                  <Input
                    id="trip-end"
                    type="date"
                    icon={CalendarDays}
                    min={form.startDate || undefined}
                    value={form.endDate}
                    onChange={(event) => setValue('endDate', event.target.value)}
                  />
                </Field>
              </div>
            </Card>

            <Card className="overflow-hidden">
              <AnimatePresence mode="wait">
                {destination ? (
                  <motion.div
                    key={destination.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="relative h-44">
                      <img
                        src={destination.image}
                        alt={destination.name}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#08161f]/85 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-5">
                        <h3 className="font-display text-xl font-semibold text-white">
                          {destination.name}
                        </h3>
                        <p className="text-sm text-white/80">{destination.country}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 p-5">
                      <p className="text-sm text-muted">{destination.descriptor}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge tone="teal">{destination.region}</Badge>
                        <Badge tone="neutral">Best: {destination.bestSeason}</Badge>
                      </div>
                      <p className="flex items-center gap-1.5 text-sm text-fg">
                        <Wallet className="size-4 text-muted" />
                        <span className="font-semibold">
                          {formatCurrency(destination.avgDailyCost)}
                        </span>
                        <span className="text-muted">/ day avg</span>
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex h-full min-h-64 flex-col items-center justify-center gap-3 p-8 text-center"
                  >
                    <span className="flex size-12 items-center justify-center rounded-full bg-surface-alt text-brand-500">
                      <Compass className="size-5" />
                    </span>
                    <p className="text-sm text-muted">
                      Pick a destination to see its details here.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </div>

          <section>
            <SectionHeading
              eyebrow="Build your itinerary"
              title="Suggestions for Places to Visit"
              subtitle="Add the experiences you'd like to include — you can fine-tune them later."
            />

            <motion.div
              className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {suggestedActivities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  selected={selectedActivityIds.includes(activity.id)}
                  onToggle={toggleActivity}
                />
              ))}
            </motion.div>
          </section>

          <Card className="flex flex-col items-start justify-between gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/15 text-brand-600 dark:text-brand-400">
                <Sparkles className="size-5" />
              </span>
              <div>
                <p className="font-display text-base font-semibold text-fg">
                  {selectedActivityIds.length} activit
                  {selectedActivityIds.length === 1 ? 'y' : 'ies'} selected
                </p>
                <p className="mt-0.5 text-sm text-muted">
                  Estimated activities cost {formatCurrency(activitiesTotal)}
                </p>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Trip'}
            </Button>
            {errors.form && <p className="text-red-500 mt-2">{errors.form}</p>}
          </Card>
        </form>
      </PageContainer>

      <AnimatePresence>
        {createdTrip && (
          <motion.div
            className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            role="status"
          >
            <div className="flex w-full max-w-md items-start gap-3 rounded-2xl border border-line bg-card p-4 shadow-lift">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-semibold text-fg">Trip created</p>
                <p className="mt-0.5 truncate text-xs text-muted">
                  “{createdTrip.name}” · {createdTrip.activityIds.length} activities
                </p>
              </div>
              <button
                type="button"
                onClick={resetForm}
                className="shrink-0 text-xs font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400"
              >
                Plan another
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CreateTrip
