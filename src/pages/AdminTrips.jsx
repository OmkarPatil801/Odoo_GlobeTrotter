import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Globe,
  Lock,
  Route,
  Search,
  Trash2,
  X,
} from 'lucide-react'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Dropdown from '../components/ui/Dropdown'
import EmptyState from '../components/ui/EmptyState'
import TripDetailsDrawer from '../components/admin/TripDetailsDrawer'
import { formatCurrency, formatDate } from '../utils/formatters'
import { adminTripSortOptions, adminTripStatusOptions, adminTrips } from '../data/adminTripsData'
import { cn } from '../utils/cn'

const PAGE_SIZE = 8
const statusTone = { upcoming: 'brand', planning: 'warning', completed: 'success' }

function AdminTrips() {
  const [trips, setTrips] = useState(adminTrips)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [sortBy, setSortBy] = useState('recent')
  const [page, setPage] = useState(1)
  const [selectedId, setSelectedId] = useState(null)

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    let list = trips

    if (needle) {
      list = list.filter((t) =>
        [t.name, t.owner, ...t.destinations].some((f) => f.toLowerCase().includes(needle)),
      )
    }
    if (status !== 'all') list = list.filter((t) => t.status === status)

    const out = [...list]
    if (sortBy === 'name') return out.sort((a, b) => a.name.localeCompare(b.name))
    if (sortBy === 'budget-high') return out.sort((a, b) => b.budget - a.budget)
    if (sortBy === 'budget-low') return out.sort((a, b) => a.budget - b.budget)
    if (sortBy === 'start') return out.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    if (sortBy === 'oldest') return out.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    return out.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [trips, query, status, sortBy])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const resetPage = (fn) => (value) => {
    fn(value)
    setPage(1)
  }

  const deleteTrip = (id) => {
    setTrips((prev) => prev.filter((t) => t.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  const clearFilters = () => {
    setQuery('')
    setStatus('all')
    setPage(1)
  }

  const filtersActive = query !== '' || status !== 'all'
  const selectedTrip = trips.find((t) => t.id === selectedId) ?? null

  const counts = useMemo(
    () => ({
      total: trips.length,
      planning: trips.filter((t) => t.status === 'planning').length,
      upcoming: trips.filter((t) => t.status === 'upcoming').length,
      completed: trips.filter((t) => t.status === 'completed').length,
      budget: trips.reduce((s, t) => s + t.budget, 0),
    }),
    [trips],
  )

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
            Management
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-fg lg:text-3xl">Trips</h1>
          <p className="mt-1 text-sm text-muted">
            {counts.total} trips · {counts.planning} planning · {counts.upcoming} upcoming ·{' '}
            {counts.completed} completed
          </p>
        </div>
        <Card className="px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-muted">Total planned budget</p>
          <p className="mt-0.5 font-display text-lg font-semibold text-fg">
            {formatCurrency(counts.budget)}
          </p>
        </Card>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-[minmax(0,2fr)_repeat(2,minmax(0,1fr))]">
        <Input
          icon={Search}
          value={query}
          onChange={(e) => resetPage(setQuery)(e.target.value)}
          placeholder="Search by trip, traveler, or destination…"
          aria-label="Search trips"
        />
        <Dropdown
          label="Status"
          options={adminTripStatusOptions}
          value={status}
          onChange={resetPage(setStatus)}
        />
        <Dropdown
          label="Sort"
          options={adminTripSortOptions}
          value={sortBy}
          onChange={resetPage(setSortBy)}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          <span className="font-semibold text-fg">{filtered.length}</span>{' '}
          {filtered.length === 1 ? 'trip' : 'trips'} found
        </p>
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
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Route}
          title="No trips match"
          description="Try a different search term or clear your filters."
          action={
            <Button size="sm" variant="secondary" onClick={clearFilters}>
              Clear filters
            </Button>
          }
          className="mt-8"
        />
      ) : (
        <Card className="mt-5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[68rem] text-left">
              <thead>
                <tr className="border-b border-line bg-surface-alt">
                  {['Trip', 'Traveler', 'Destinations', 'Start', 'End', 'Budget', 'Status', 'Actions'].map(
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
                {pageRows.map((trip, i) => (
                  <motion.tr
                    key={trip.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.02 }}
                    className="border-b border-line last:border-b-0 transition-colors hover:bg-surface-alt"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-muted">
                          {trip.isPublic ? (
                            <Globe className="size-3.5" />
                          ) : (
                            <Lock className="size-3.5" />
                          )}
                        </span>
                        <p className="truncate text-sm font-medium text-fg">{trip.name}</p>
                      </div>
                    </td>

                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-500/15 text-[10px] font-semibold text-brand-600 dark:text-brand-400">
                          {trip.ownerInitials}
                        </span>
                        <span className="truncate text-sm text-muted">{trip.owner}</span>
                      </div>
                    </td>

                    <td className="px-5 py-3">
                      <p className="truncate text-sm text-muted">
                        {trip.destinations.join(' • ')}
                      </p>
                    </td>

                    <td className="px-5 py-3 text-sm text-muted">{formatDate(trip.startDate)}</td>
                    <td className="px-5 py-3 text-sm text-muted">{formatDate(trip.endDate)}</td>

                    <td className="px-5 py-3">
                      <p className="text-sm font-semibold text-fg">
                        {formatCurrency(trip.budget)}
                      </p>
                      <p
                        className={cn(
                          'text-xs',
                          trip.spent > trip.budget
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-muted',
                        )}
                      >
                        {formatCurrency(trip.spent)} spent
                      </p>
                    </td>

                    <td className="px-5 py-3">
                      <Badge tone={statusTone[trip.status]}>{trip.status}</Badge>
                    </td>

                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setSelectedId(trip.id)}
                          aria-label={`View ${trip.name}`}
                          className="rounded-lg p-2 text-muted transition-colors hover:bg-card hover:text-fg"
                        >
                          <Eye className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteTrip(trip.id)}
                          aria-label={`Delete ${trip.name}`}
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

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-3.5">
            <p className="text-xs text-muted">
              Showing {(currentPage - 1) * PAGE_SIZE + 1}–
              {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
                className="flex size-8 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:text-fg disabled:opacity-40"
              >
                <ChevronLeft className="size-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={cn(
                    'size-8 rounded-lg text-xs font-medium transition-colors',
                    p === currentPage
                      ? 'bg-brand-500 text-white'
                      : 'border border-line text-muted hover:text-fg',
                  )}
                >
                  {p}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                aria-label="Next page"
                className="flex size-8 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:text-fg disabled:opacity-40"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </Card>
      )}

      <TripDetailsDrawer
        trip={selectedTrip}
        onClose={() => setSelectedId(null)}
        onDelete={deleteTrip}
      />
    </div>
  )
}

export default AdminTrips
