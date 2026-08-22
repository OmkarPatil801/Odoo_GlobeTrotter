import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ArrowRight,
  ArrowUpRight,
  Plane,
  Route,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import { formatCurrency, formatDate } from '../utils/formatters'
import { staggerContainer, staggerItem } from '../utils/motionVariants'
import {
  adminActivityMix,
  adminPopularDestinations,
  adminQuickActions,
  adminRecentTrips,
  adminRecentUsers,
  adminSignupTrend,
  adminStats,
} from '../data/adminMockData'
import { cn } from '../utils/cn'

const numberFmt = new Intl.NumberFormat('en-IN')

const kpis = [
  { label: 'Total users', value: numberFmt.format(adminStats.totalUsers), delta: adminStats.totalUsersDelta, icon: Users },
  { label: 'Total trips', value: numberFmt.format(adminStats.totalTrips), delta: adminStats.totalTripsDelta, icon: Route },
  { label: 'Active trips', value: numberFmt.format(adminStats.activeTrips), delta: adminStats.activeTripsDelta, icon: Plane },
  { label: 'Revenue', value: formatCurrency(adminStats.revenue), delta: adminStats.revenueDelta, icon: Wallet },
]

const userStatusTone = { active: 'success', pending: 'warning', suspended: 'brand' }
const tripStatusTone = { upcoming: 'brand', planning: 'warning', completed: 'success' }

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-line bg-card px-3 py-2 shadow-lift">
      {label && <p className="text-xs font-medium text-fg">{label}</p>}
      {payload.map((p) => (
        <p key={p.dataKey ?? p.name} className="text-xs text-muted">
          {p.name}: <span className="font-semibold text-fg">{p.value}</span>
        </p>
      ))}
    </div>
  )
}

function AdminDashboard() {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
            Overview
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-fg lg:text-3xl">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted">
            Platform health, growth, and what needs attention today.
          </p>
        </div>
        <Badge tone="success">All systems operational</Badge>
      </div>

      <motion.div
        className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {kpis.map((kpi) => {
          const up = kpi.delta >= 0
          return (
            <motion.div key={kpi.label} variants={staggerItem}>
              <Card className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-brand-500/15 text-brand-600 dark:text-brand-400">
                    <kpi.icon className="size-5" />
                  </span>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold',
                      up
                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                        : 'bg-rose-500/15 text-rose-700 dark:text-rose-400',
                    )}
                  >
                    {up ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                    {Math.abs(kpi.delta)}%
                  </span>
                </div>
                <p className="mt-4 text-xs uppercase tracking-wide text-muted">{kpi.label}</p>
                <p className="mt-1 font-display text-2xl font-semibold text-fg">{kpi.value}</p>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card className="p-5 sm:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-base font-semibold text-fg">Growth</h2>
            <p className="text-xs text-muted">New users and trips, last 6 months</p>
          </div>

          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={adminSignupTrend} margin={{ top: 4, right: 4, bottom: 0, left: -12 }}>
                <defs>
                  <linearGradient id="gUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-brand-500)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-brand-500)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gTrips" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-teal-500)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-teal-500)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--color-line)" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: 'var(--color-muted)' }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={44}
                  tick={{ fontSize: 11, fill: 'var(--color-muted)' }}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="users"
                  name="Users"
                  stroke="var(--color-brand-500)"
                  strokeWidth={2}
                  fill="url(#gUsers)"
                />
                <Area
                  type="monotone"
                  dataKey="trips"
                  name="Trips"
                  stroke="var(--color-teal-500)"
                  strokeWidth={2}
                  fill="url(#gTrips)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <h2 className="font-display text-base font-semibold text-fg">Activity mix</h2>
          <p className="text-xs text-muted">Share of booked activities</p>

          <div className="mt-2 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={adminActivityMix}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={48}
                  outerRadius={74}
                  paddingAngle={2}
                  stroke="none"
                >
                  {adminActivityMix.map((a) => (
                    <Cell key={a.name} fill={a.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <ul className="mt-3 flex flex-col gap-2">
            {adminActivityMix.map((a) => (
              <li key={a.name} className="flex items-center justify-between gap-3 text-sm">
                <span className="flex min-w-0 items-center gap-2">
                  <span className="size-2.5 shrink-0 rounded-full" style={{ background: a.color }} />
                  <span className="truncate text-fg">{a.name}</span>
                </span>
                <span className="shrink-0 text-xs font-semibold text-muted">{a.value}%</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_20rem]">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
            <h2 className="font-display text-base font-semibold text-fg">Recent users</h2>
            <Link
              to="/admin/users"
              className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400"
            >
              View all
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <ul className="flex flex-col">
            {adminRecentUsers.map((user, i) => (
              <li
                key={user.id}
                className={cn('flex items-center gap-3 px-5 py-3', i > 0 && 'border-t border-line')}
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-500/15 text-xs font-semibold text-brand-600 dark:text-brand-400">
                  {user.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-fg">{user.name}</p>
                  <p className="truncate text-xs text-muted">{user.email}</p>
                </div>
                <div className="shrink-0 text-right">
                  <Badge tone={userStatusTone[user.status]}>{user.status}</Badge>
                  <p className="mt-1 text-[11px] text-muted">{user.trips} trips</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
            <h2 className="font-display text-base font-semibold text-fg">Recent trips</h2>
            <Link
              to="/admin/trips"
              className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400"
            >
              View all
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <ul className="flex flex-col">
            {adminRecentTrips.map((trip, i) => (
              <li
                key={trip.id}
                className={cn('flex items-center gap-3 px-5 py-3', i > 0 && 'border-t border-line')}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-fg">{trip.name}</p>
                  <p className="truncate text-xs text-muted">
                    {trip.owner} · {trip.destinations} stop{trip.destinations > 1 ? 's' : ''} ·{' '}
                    {formatDate(trip.startDate)}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <Badge tone={tripStatusTone[trip.status]}>{trip.status}</Badge>
                  <p className="mt-1 text-[11px] font-semibold text-fg">
                    {formatCurrency(trip.budget)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <div className="flex flex-col gap-5">
          <Card className="overflow-hidden">
            <div className="border-b border-line px-5 py-4">
              <h2 className="font-display text-base font-semibold text-fg">
                Popular destinations
              </h2>
            </div>
            <ul className="flex flex-col">
              {adminPopularDestinations.map((d, i) => (
                <li
                  key={d.id}
                  className={cn('flex items-center gap-3 px-5 py-3', i > 0 && 'border-t border-line')}
                >
                  <img
                    src={d.image}
                    alt=""
                    className="size-9 shrink-0 rounded-lg object-cover"
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-fg">{d.name}</p>
                    <p className="truncate text-xs text-muted">{d.country}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold text-fg">{d.trips}</p>
                    <p className="text-[11px] text-muted">{d.share}%</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-5">
            <h2 className="font-display text-base font-semibold text-fg">Quick actions</h2>
            <div className="mt-3 flex flex-col gap-2">
              {adminQuickActions.map((action) => (
                <motion.div key={action.id} whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
                  <Link
                    to={action.to}
                    className="flex items-center gap-3 rounded-xl border border-line bg-surface-alt px-3.5 py-3 transition-colors hover:border-brand-500/50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-fg">{action.label}</p>
                      <p className="truncate text-xs text-muted">{action.description}</p>
                    </div>
                    <ArrowUpRight className="size-4 shrink-0 text-muted" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
