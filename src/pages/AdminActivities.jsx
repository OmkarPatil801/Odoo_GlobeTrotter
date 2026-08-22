import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import {
  Clock,
  LayoutGrid,
  List,
  MapPin,
  Pencil,
  Plus,
  Search,
  Star,
  Ticket,
  Trash2,
  X,
} from 'lucide-react'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Dropdown from '../components/ui/Dropdown'
import EmptyState from '../components/ui/EmptyState'
import ActivityFormModal from '../components/admin/ActivityFormModal'
import { formatCurrency } from '../utils/formatters'
import { staggerContainer, staggerItem } from '../utils/motionVariants'
import {
  adminActivities,
  adminActivityCategoryOptions,
  adminActivitySortOptions,
  adminActivityStatusFilterOptions,
} from '../data/adminActivitiesData'
import { cn } from '../utils/cn'

const statusTone = { published: 'success', pending: 'warning', archived: 'neutral' }

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80'

function AdminActivities() {
  const [activities, setActivities] = useState(adminActivities)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('all')
  const [sortBy, setSortBy] = useState('bookings')
  const [view, setView] = useState('grid')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase()
    let list = activities

    if (needle) {
      list = list.filter((a) =>
        [a.name, a.destination, a.country, a.category, a.description].some((f) =>
          (f ?? '').toLowerCase().includes(needle),
        ),
      )
    }
    if (category !== 'all') list = list.filter((a) => a.category === category)
    if (status !== 'all') list = list.filter((a) => a.status === status)

    const out = [...list]
    if (sortBy === 'name') return out.sort((a, b) => a.name.localeCompare(b.name))
    if (sortBy === 'rating') return out.sort((a, b) => b.rating - a.rating)
    if (sortBy === 'price-high') return out.sort((a, b) => b.price - a.price)
    if (sortBy === 'price-low') return out.sort((a, b) => a.price - b.price)
    return out.sort((a, b) => b.bookings - a.bookings)
  }, [activities, query, category, status, sortBy])

  const openAdd = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (activity) => {
    setEditing(activity)
    setModalOpen(true)
  }

  const handleSave = (values) => {
    if (editing) {
      setActivities((prev) => prev.map((a) => (a.id === editing.id ? { ...a, ...values } : a)))
    } else {
      setActivities((prev) => [
        {
          id: `aa-${Date.now()}`,
          rating: 0,
          bookings: 0,
          ...values,
          image: values.image || FALLBACK_IMAGE,
        },
        ...prev,
      ])
    }
    setModalOpen(false)
    setEditing(null)
  }

  const deleteActivity = (id) => setActivities((prev) => prev.filter((a) => a.id !== id))

  const clearFilters = () => {
    setQuery('')
    setCategory('all')
    setStatus('all')
  }

  const filtersActive = query !== '' || category !== 'all' || status !== 'all'

  const counts = useMemo(
    () => ({
      total: activities.length,
      published: activities.filter((a) => a.status === 'published').length,
      pending: activities.filter((a) => a.status === 'pending').length,
      archived: activities.filter((a) => a.status === 'archived').length,
    }),
    [activities],
  )

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
            Catalog
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-fg lg:text-3xl">
            Activities
          </h1>
          <p className="mt-1 text-sm text-muted">
            {counts.total} activities · {counts.published} published · {counts.pending} pending ·{' '}
            {counts.archived} archived
          </p>
        </div>
        <Button icon={Plus} onClick={openAdd}>
          Add Activity
        </Button>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))]">
        <Input
          icon={Search}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search activities, destinations, or categories…"
          aria-label="Search activities"
        />
        <Dropdown
          label="Category"
          options={adminActivityCategoryOptions}
          value={category}
          onChange={setCategory}
        />
        <Dropdown
          label="Status"
          options={adminActivityStatusFilterOptions}
          value={status}
          onChange={setStatus}
        />
        <Dropdown
          label="Sort"
          options={adminActivitySortOptions}
          value={sortBy}
          onChange={setSortBy}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          <span className="font-semibold text-fg">{results.length}</span>{' '}
          {results.length === 1 ? 'activity' : 'activities'} found
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

          <div className="flex items-center gap-1 rounded-full border border-line bg-card p-1">
            {[
              ['grid', LayoutGrid, 'Grid'],
              ['list', List, 'List'],
            ].map(([value, Icon, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setView(value)}
                aria-label={`${label} view`}
                className={cn(
                  'relative inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                  view === value ? 'text-white' : 'text-muted hover:text-fg',
                )}
              >
                {view === value && (
                  <motion.span
                    layoutId="act-view"
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

      {results.length === 0 ? (
        <EmptyState
          icon={Ticket}
          title="No activities match"
          description="Try a different search term or clear your filters."
          action={
            <Button size="sm" variant="secondary" onClick={clearFilters}>
              Clear filters
            </Button>
          }
          className="mt-8"
        />
      ) : view === 'grid' ? (
        <motion.div
          className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {results.map((a) => (
            <motion.div key={a.id} variants={staggerItem} whileHover={{ y: -4 }}>
              <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lift">
                <div className="relative h-36 overflow-hidden">
                  <img src={a.image} alt={a.name} className="h-full w-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08161f]/70 to-transparent" />
                  <Badge tone={statusTone[a.status]} className="absolute left-3 top-3">
                    {a.status}
                  </Badge>
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    <Star className="size-3 fill-current" />
                    {a.rating || '—'}
                  </span>
                  <p className="absolute inset-x-0 bottom-0 flex items-center gap-1.5 p-3 text-xs text-white/90">
                    <MapPin className="size-3.5 shrink-0" />
                    <span className="truncate">
                      {a.destination}
                      {a.country ? `, ${a.country}` : ''}
                    </span>
                  </p>
                </div>

                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div>
                    <h3 className="font-display text-base font-semibold text-fg">{a.name}</h3>
                    <p className="mt-1 line-clamp-2 text-xs text-muted">{a.description}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="teal">{a.category}</Badge>
                    <span className="flex items-center gap-1 text-xs text-muted">
                      <Clock className="size-3" />
                      {a.duration}h
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted">
                      <Ticket className="size-3" />
                      {a.bookings}
                    </span>
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-2 border-t border-line pt-3">
                    <span className="font-display text-base font-semibold text-fg">
                      {formatCurrency(a.price)}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(a)}
                        aria-label={`Edit ${a.name}`}
                        className="rounded-lg border border-line p-2 text-muted transition-colors hover:text-fg"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteActivity(a.id)}
                        aria-label={`Delete ${a.name}`}
                        className="rounded-lg border border-line p-2 text-muted transition-colors hover:border-rose-500/50 hover:text-rose-600 dark:hover:text-rose-400"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <Card className="mt-5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[62rem] text-left">
              <thead>
                <tr className="border-b border-line bg-surface-alt">
                  {['Activity', 'Destination', 'Category', 'Price', 'Duration', 'Bookings', 'Status', 'Actions'].map(
                    (h) => (
                      <th
                        key={h}
                        className={cn(
                          'px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted',
                          h === 'Actions' && 'text-right',
                        )}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>

              <tbody>
                {results.map((a, i) => (
                  <motion.tr
                    key={a.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.02 }}
                    className="border-b border-line last:border-b-0 transition-colors hover:bg-surface-alt"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={a.image}
                          alt=""
                          className="size-10 shrink-0 rounded-lg object-cover"
                          loading="lazy"
                        />
                        <p className="truncate text-sm font-medium text-fg">{a.name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-muted">{a.destination}</td>
                    <td className="px-5 py-3">
                      <Badge tone="teal">{a.category}</Badge>
                    </td>
                    <td className="px-5 py-3 text-sm font-semibold text-fg">
                      {formatCurrency(a.price)}
                    </td>
                    <td className="px-5 py-3 text-sm text-muted">{a.duration}h</td>
                    <td className="px-5 py-3 text-sm text-muted">{a.bookings}</td>
                    <td className="px-5 py-3">
                      <Badge tone={statusTone[a.status]}>{a.status}</Badge>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(a)}
                          aria-label={`Edit ${a.name}`}
                          className="rounded-lg p-2 text-muted transition-colors hover:bg-card hover:text-fg"
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteActivity(a.id)}
                          aria-label={`Delete ${a.name}`}
                          className="rounded-lg p-2 text-muted transition-colors hover:bg-card hover:text-rose-600 dark:hover:text-rose-400"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <ActivityFormModal
        open={modalOpen}
        initial={editing}
        onSave={handleSave}
        onClose={() => {
          setModalOpen(false)
          setEditing(null)
        }}
      />
    </div>
  )
}

export default AdminActivities
