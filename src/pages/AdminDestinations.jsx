import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import {
  LayoutGrid,
  List,
  MapPin,
  Pencil,
  Plus,
  Search,
  Ticket,
  Trash2,
  TrendingUp,
  X,
} from 'lucide-react'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Dropdown from '../components/ui/Dropdown'
import EmptyState from '../components/ui/EmptyState'
import DestinationFormModal from '../components/admin/DestinationFormModal'
import { staggerContainer, staggerItem } from '../utils/motionVariants'
import {
  adminDestinationCategoryOptions,
  adminDestinationRegionOptions,
  adminDestinationSortOptions,
  adminDestinations,
} from '../data/adminDestinationsData'
import { cn } from '../utils/cn'

const statusTone = { published: 'success', draft: 'warning', archived: 'neutral' }

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80'

function AdminDestinations() {
  const [destinations, setDestinations] = useState(adminDestinations)
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState('all')
  const [category, setCategory] = useState('all')
  const [sortBy, setSortBy] = useState('popularity')
  const [view, setView] = useState('grid')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase()
    let list = destinations

    if (needle) {
      list = list.filter((d) =>
        [d.name, d.country, d.region, d.category, d.description].some((f) =>
          f.toLowerCase().includes(needle),
        ),
      )
    }
    if (region !== 'all') list = list.filter((d) => d.region === region)
    if (category !== 'all') list = list.filter((d) => d.category === category)

    const out = [...list]
    if (sortBy === 'name') return out.sort((a, b) => a.name.localeCompare(b.name))
    if (sortBy === 'trips') return out.sort((a, b) => b.trips - a.trips)
    if (sortBy === 'activities') return out.sort((a, b) => b.activities - a.activities)
    return out.sort((a, b) => b.popularity - a.popularity)
  }, [destinations, query, region, category, sortBy])

  const openAdd = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (destination) => {
    setEditing(destination)
    setModalOpen(true)
  }

  const handleSave = (values) => {
    if (editing) {
      setDestinations((prev) =>
        prev.map((d) => (d.id === editing.id ? { ...d, ...values } : d)),
      )
    } else {
      setDestinations((prev) => [
        {
          id: `ad-${Date.now()}`,
          popularity: 0,
          trips: 0,
          activities: 0,
          ...values,
          image: values.image || FALLBACK_IMAGE,
        },
        ...prev,
      ])
    }
    setModalOpen(false)
    setEditing(null)
  }

  const deleteDestination = (id) =>
    setDestinations((prev) => prev.filter((d) => d.id !== id))

  const clearFilters = () => {
    setQuery('')
    setRegion('all')
    setCategory('all')
  }

  const filtersActive = query !== '' || region !== 'all' || category !== 'all'

  const counts = useMemo(
    () => ({
      total: destinations.length,
      published: destinations.filter((d) => d.status === 'published').length,
      draft: destinations.filter((d) => d.status === 'draft').length,
      archived: destinations.filter((d) => d.status === 'archived').length,
    }),
    [destinations],
  )

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
            Catalog
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-fg lg:text-3xl">
            Destinations
          </h1>
          <p className="mt-1 text-sm text-muted">
            {counts.total} destinations · {counts.published} published · {counts.draft} draft ·{' '}
            {counts.archived} archived
          </p>
        </div>
        <Button icon={Plus} onClick={openAdd}>
          Add Destination
        </Button>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))]">
        <Input
          icon={Search}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search destinations, countries, or regions…"
          aria-label="Search destinations"
        />
        <Dropdown
          label="Region"
          options={adminDestinationRegionOptions}
          value={region}
          onChange={setRegion}
        />
        <Dropdown
          label="Category"
          options={adminDestinationCategoryOptions}
          value={category}
          onChange={setCategory}
        />
        <Dropdown
          label="Sort"
          options={adminDestinationSortOptions}
          value={sortBy}
          onChange={setSortBy}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          <span className="font-semibold text-fg">{results.length}</span>{' '}
          {results.length === 1 ? 'destination' : 'destinations'} found
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
                    layoutId="dest-view"
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
          icon={MapPin}
          title="No destinations match"
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
          {results.map((d) => (
            <motion.div key={d.id} variants={staggerItem} whileHover={{ y: -4 }}>
              <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lift">
                <div className="relative h-36 overflow-hidden">
                  <img src={d.image} alt={d.name} className="h-full w-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08161f]/70 to-transparent" />
                  <Badge tone={statusTone[d.status]} className="absolute left-3 top-3">
                    {d.status}
                  </Badge>
                  <span className="absolute right-3 top-3 rounded-full bg-white/20 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    {d.category}
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div>
                    <h3 className="font-display text-base font-semibold text-fg">{d.name}</h3>
                    <p className="text-xs text-muted">
                      {d.country} · {d.region}
                    </p>
                    <p className="mt-1.5 line-clamp-2 text-xs text-muted">{d.description}</p>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-center gap-4 text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="size-3.5" />
                        {d.popularity}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3.5" />
                        {d.trips}
                      </span>
                      <span className="flex items-center gap-1">
                        <Ticket className="size-3.5" />
                        {d.activities}
                      </span>
                    </div>

                    <div className="mt-3 flex gap-2 border-t border-line pt-3">
                      <Button
                        size="sm"
                        variant="secondary"
                        icon={Pencil}
                        className="flex-1"
                        onClick={() => openEdit(d)}
                      >
                        Edit
                      </Button>
                      <button
                        type="button"
                        onClick={() => deleteDestination(d.id)}
                        aria-label={`Delete ${d.name}`}
                        className="rounded-full border border-line px-3 text-muted transition-colors hover:border-rose-500/50 hover:text-rose-600 dark:hover:text-rose-400"
                      >
                        <Trash2 className="size-4" />
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
            <table className="w-full min-w-[60rem] text-left">
              <thead>
                <tr className="border-b border-line bg-surface-alt">
                  {['Destination', 'Region', 'Category', 'Popularity', 'Trips', 'Activities', 'Status', 'Actions'].map(
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
                {results.map((d, i) => (
                  <motion.tr
                    key={d.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.02 }}
                    className="border-b border-line last:border-b-0 transition-colors hover:bg-surface-alt"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={d.image}
                          alt=""
                          className="size-10 shrink-0 rounded-lg object-cover"
                          loading="lazy"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-fg">{d.name}</p>
                          <p className="truncate text-xs text-muted">{d.country}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-muted">{d.region}</td>
                    <td className="px-5 py-3">
                      <Badge tone="teal">{d.category}</Badge>
                    </td>
                    <td className="px-5 py-3 text-sm font-semibold text-fg">{d.popularity}</td>
                    <td className="px-5 py-3 text-sm text-muted">{d.trips}</td>
                    <td className="px-5 py-3 text-sm text-muted">{d.activities}</td>
                    <td className="px-5 py-3">
                      <Badge tone={statusTone[d.status]}>{d.status}</Badge>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(d)}
                          aria-label={`Edit ${d.name}`}
                          className="rounded-lg p-2 text-muted transition-colors hover:bg-card hover:text-fg"
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteDestination(d.id)}
                          aria-label={`Delete ${d.name}`}
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

      <DestinationFormModal
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

export default AdminDestinations
