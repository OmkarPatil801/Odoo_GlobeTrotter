import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CalendarRange, Layers, Plus, Wallet } from 'lucide-react'
import PageContainer from '../components/ui/PageContainer'
import SectionHeading from '../components/ui/SectionHeading'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import ItinerarySectionCard from '../components/itinerary/ItinerarySectionCard'
import SectionForm from '../components/itinerary/SectionForm'
import { formatCurrency } from '../utils/formatters'
import { fadeSlideUp } from '../utils/motionVariants'
import { itinerarySections } from '../data/mockData'

const MS_PER_DAY = 86400000

function ItineraryBuilder() {
  const [sections, setSections] = useState(itinerarySections)
  const [expandedIds, setExpandedIds] = useState([itinerarySections[0]?.id])
  const [editingId, setEditingId] = useState(null)
  const [adding, setAdding] = useState(false)

  const summary = useMemo(() => {
    const totalBudget = sections.reduce((sum, s) => sum + s.budget, 0)
    if (sections.length === 0) return { count: 0, days: 0, totalBudget: 0 }

    const starts = sections.map((s) => new Date(s.startDate).getTime())
    const ends = sections.map((s) => new Date(s.endDate).getTime())
    const days = Math.round((Math.max(...ends) - Math.min(...starts)) / MS_PER_DAY) + 1

    return { count: sections.length, days, totalBudget }
  }, [sections])

  const toggleExpanded = (id) =>
    setExpandedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const handleDelete = (id) => setSections((prev) => prev.filter((s) => s.id !== id))

  const handleSave = (values) => {
    if (editingId) {
      setSections((prev) => prev.map((s) => (s.id === editingId ? { ...s, ...values } : s)))
      setEditingId(null)
    } else {
      const id = `sec-${Date.now()}`
      setSections((prev) => [...prev, { id, ...values }])
      setExpandedIds((prev) => [...prev, id])
      setAdding(false)
    }
  }

  const stats = [
    { label: 'Total sections', value: summary.count, icon: Layers },
    { label: 'Trip duration', value: `${summary.days} day${summary.days === 1 ? '' : 's'}`, icon: CalendarRange },
    { label: 'Estimated budget', value: formatCurrency(summary.totalBudget), icon: Wallet },
  ]

  return (
    <div className="pb-24">
      <PageContainer className="pt-10 sm:pt-14">
        <motion.div initial="hidden" animate="visible" variants={fadeSlideUp}>
          <SectionHeading
            eyebrow="Trip planner"
            title="Build Your Itinerary"
            subtitle="Break your trip into sections, then edit budgets and dates as plans firm up."
          />
        </motion.div>

        <motion.div
          className="mt-8 grid gap-4 sm:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={fadeSlideUp}
        >
          {stats.map((stat) => (
            <Card key={stat.label} className="flex items-center gap-3.5 p-5">
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

        <div className="mt-10 flex flex-col gap-4">
          {sections.length === 0 && !adding && (
            <EmptyState
              icon={Layers}
              title="No sections yet"
              description="Add your first itinerary section to start building this trip."
            />
          )}

          <AnimatePresence mode="popLayout">
            {sections.map((section, index) =>
              editingId === section.id ? (
                <SectionForm
                  key={`edit-${section.id}`}
                  initial={section}
                  onSave={handleSave}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <ItinerarySectionCard
                  key={section.id}
                  section={section}
                  index={index}
                  expanded={expandedIds.includes(section.id)}
                  onToggle={toggleExpanded}
                  onEdit={setEditingId}
                  onDelete={handleDelete}
                />
              ),
            )}
          </AnimatePresence>

          <AnimatePresence>
            {adding && (
              <SectionForm key="add" onSave={handleSave} onCancel={() => setAdding(false)} />
            )}
          </AnimatePresence>

          {!adding && (
            <motion.button
              type="button"
              layout
              onClick={() => setAdding(true)}
              whileHover={{ scale: 1.005 }}
              whileTap={{ scale: 0.995 }}
              className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-line bg-surface-alt py-5 text-sm font-medium text-fg transition-colors hover:border-brand-500/50 hover:text-brand-600 dark:hover:text-brand-400"
            >
              <Plus className="size-4" />
              Add Another Section
            </motion.button>
          )}
        </div>
      </PageContainer>
    </div>
  )
}

export default ItineraryBuilder
