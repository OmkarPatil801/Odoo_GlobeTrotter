import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import {
  Ban,
  ChevronLeft,
  ChevronRight,
  Eye,
  Search,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
  X,
} from 'lucide-react'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Dropdown from '../components/ui/Dropdown'
import EmptyState from '../components/ui/EmptyState'
import UserDetailsDrawer from '../components/admin/UserDetailsDrawer'
import { formatCurrency, formatDate } from '../utils/formatters'
import {
  adminUserRoleOptions,
  adminUserSortOptions,
  adminUserStatusOptions,
  adminUsers,
} from '../data/adminMockData'
import { cn } from '../utils/cn'

const PAGE_SIZE = 8
const statusTone = { active: 'success', pending: 'warning', suspended: 'brand' }

function AdminUsers() {
  const [users, setUsers] = useState(adminUsers)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [role, setRole] = useState('all')
  const [sortBy, setSortBy] = useState('recent')
  const [page, setPage] = useState(1)
  const [selectedId, setSelectedId] = useState(null)

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    let list = users

    if (needle) {
      list = list.filter((u) =>
        [u.name, u.email, u.country].some((f) => f.toLowerCase().includes(needle)),
      )
    }
    if (status !== 'all') list = list.filter((u) => u.status === status)
    if (role !== 'all') list = list.filter((u) => u.role === role)

    const out = [...list]
    if (sortBy === 'name') return out.sort((a, b) => a.name.localeCompare(b.name))
    if (sortBy === 'trips') return out.sort((a, b) => b.trips - a.trips)
    if (sortBy === 'spend') return out.sort((a, b) => b.totalSpend - a.totalSpend)
    if (sortBy === 'oldest') return out.sort((a, b) => new Date(a.joinedAt) - new Date(b.joinedAt))
    return out.sort((a, b) => new Date(b.joinedAt) - new Date(a.joinedAt))
  }, [users, query, status, role, sortBy])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const resetPage = (fn) => (value) => {
    fn(value)
    setPage(1)
  }

  const toggleStatus = (id) =>
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === 'suspended' ? 'active' : 'suspended' } : u,
      ),
    )

  const deleteUser = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  const clearFilters = () => {
    setQuery('')
    setStatus('all')
    setRole('all')
    setPage(1)
  }

  const filtersActive = query !== '' || status !== 'all' || role !== 'all'
  const selectedUser = users.find((u) => u.id === selectedId) ?? null

  const counts = useMemo(
    () => ({
      total: users.length,
      active: users.filter((u) => u.status === 'active').length,
      pending: users.filter((u) => u.status === 'pending').length,
      suspended: users.filter((u) => u.status === 'suspended').length,
    }),
    [users],
  )

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
            Management
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-fg lg:text-3xl">Users</h1>
          <p className="mt-1 text-sm text-muted">
            {counts.total} accounts · {counts.active} active · {counts.pending} pending ·{' '}
            {counts.suspended} suspended
          </p>
        </div>
        <Button icon={UserPlus}>Invite user</Button>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))]">
        <Input
          icon={Search}
          value={query}
          onChange={(e) => resetPage(setQuery)(e.target.value)}
          placeholder="Search by name, email, or country…"
          aria-label="Search users"
        />
        <Dropdown
          label="Status"
          options={adminUserStatusOptions}
          value={status}
          onChange={resetPage(setStatus)}
        />
        <Dropdown
          label="Role"
          options={adminUserRoleOptions}
          value={role}
          onChange={resetPage(setRole)}
        />
        <Dropdown
          label="Sort"
          options={adminUserSortOptions}
          value={sortBy}
          onChange={resetPage(setSortBy)}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          <span className="font-semibold text-fg">{filtered.length}</span>{' '}
          {filtered.length === 1 ? 'user' : 'users'} found
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
          icon={Users}
          title="No users match"
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
            <table className="w-full min-w-[64rem] text-left">
              <thead>
                <tr className="border-b border-line bg-surface-alt">
                  {['User', 'Registered', 'Trips', 'Total spend', 'Role', 'Status', 'Actions'].map(
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
                {pageRows.map((user, i) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.02 }}
                    className="border-b border-line last:border-b-0 transition-colors hover:bg-surface-alt"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-500/15 text-xs font-semibold text-brand-600 dark:text-brand-400">
                          {user.initials}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-fg">{user.name}</p>
                          <p className="truncate text-xs text-muted">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-muted">{formatDate(user.joinedAt)}</td>
                    <td className="px-5 py-3 text-sm font-semibold text-fg">{user.trips}</td>
                    <td className="px-5 py-3 text-sm text-fg">
                      {formatCurrency(user.totalSpend)}
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone="teal">{user.role}</Badge>
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone={statusTone[user.status]}>{user.status}</Badge>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setSelectedId(user.id)}
                          aria-label={`View ${user.name}`}
                          className="rounded-lg p-2 text-muted transition-colors hover:bg-card hover:text-fg"
                        >
                          <Eye className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleStatus(user.id)}
                          aria-label={`${user.status === 'suspended' ? 'Reactivate' : 'Deactivate'} ${user.name}`}
                          className="rounded-lg p-2 text-muted transition-colors hover:bg-card hover:text-amber-600 dark:hover:text-amber-400"
                        >
                          {user.status === 'suspended' ? (
                            <ShieldCheck className="size-4" />
                          ) : (
                            <Ban className="size-4" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteUser(user.id)}
                          aria-label={`Delete ${user.name}`}
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

      <UserDetailsDrawer
        user={selectedUser}
        onClose={() => setSelectedId(null)}
        onToggleStatus={toggleStatus}
      />
    </div>
  )
}

export default AdminUsers
