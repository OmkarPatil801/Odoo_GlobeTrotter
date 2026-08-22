import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { TrendingDown, TrendingUp, Users, Route, Wallet, Landmark } from 'lucide-react'
import Card from '../components/ui/Card'
import Dropdown from '../components/ui/Dropdown'
import { formatCurrency } from '../utils/formatters'
import { staggerContainer, staggerItem } from '../utils/motionVariants'
import { cn } from '../utils/cn'
import {
  adminAnalyticsRangeOptions,
  adminAnalyticsSummary,
  adminAnalyticsTrends,
  adminBudgetBreakdown,
  adminPopularActivities,
  adminPopularDestinations,
} from '../data/adminMockData'

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-line bg-card px-3 py-2 shadow-lift">
      {label && <p className="text-xs font-medium text-fg">{label}</p>}
      {payload.map((p) => (
        <p key={p.dataKey ?? p.name} className="text-xs text-muted">
          {p.name}: <span className="font-semibold text-fg">{p.value.toLocaleString('en-IN')}</span>
        </p>
      ))}
    </div>
  )
}

const numberFmt = new Intl.NumberFormat('en-IN')

function AdminAnalytics() {
  const [range, setRange] = useState('6m')
  const trend = useMemo(() => adminAnalyticsTrends[range], [range])
  const maxBookings = Math.max(...adminPopularActivities.map((a) => a.bookings))

  const kpis = [
    { label: 'Total users', value: numberFmt.format(adminAnalyticsSummary.totalUsers), delta: adminAnalyticsSummary.totalUsersDelta, icon: Users },
    { label: 'Total trips', value: numberFmt.format(adminAnalyticsSummary.totalTrips), delta: adminAnalyticsSummary.totalTripsDelta, icon: Route },
    { label: 'Total spend', value: formatCurrency(adminAnalyticsSummary.totalSpend), delta: adminAnalyticsSummary.totalSpendDelta, icon: Wallet },
    { label: 'Avg. trip budget', value: formatCurrency(adminAnalyticsSummary.avgTripBudget), delta: adminAnalyticsSummary.avgTripBudgetDelta, icon: Landmark },
  ]

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
            Insights
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-fg lg:text-3xl">
            Analytics
          </h1>
          <p className="mt-1 text-sm text-muted">
            Growth, destinations, activities, and spending across the platform.
          </p>
        </div>
        <Dropdown
          label="Range"
          options={adminAnalyticsRangeOptions}
          value={range}
          onChange={setRange}
          className="w-48"
        />
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
            <h2 className="font-display text-base font-semibold text-fg">Trip &amp; user trends</h2>
            <p className="text-xs text-muted">New users and trips over time</p>
          </div>

          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ top: 4, right: 4, bottom: 0, left: -12 }}>
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
          <h2 className="font-display text-base font-semibold text-fg">Budget breakdown</h2>
          <p className="text-xs text-muted">Share of total spend by category</p>

          <div className="mt-2 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={adminBudgetBreakdown}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={48}
                  outerRadius={74}
                  paddingAngle={2}
                  stroke="none"
                >
                  {adminBudgetBreakdown.map((b) => (
                    <Cell key={b.name} fill={b.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <ul className="mt-3 flex flex-col gap-2">
            {adminBudgetBreakdown.map((b) => (
              <li key={b.name} className="flex items-center justify-between gap-3 text-sm">
                <span className="flex min-w-0 items-center gap-2">
                  <span className="size-2.5 shrink-0 rounded-full" style={{ background: b.color }} />
                  <span className="truncate text-fg">{b.name}</span>
                </span>
                <span className="shrink-0 text-xs font-semibold text-muted">{b.value}%</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card className="overflow-hidden">
          <div className="border-b border-line px-5 py-4">
            <h2 className="font-display text-base font-semibold text-fg">Popular destinations</h2>
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

        <Card className="p-5 sm:p-6">
          <h2 className="font-display text-base font-semibold text-fg">Popular activities</h2>
          <p className="text-xs text-muted">Bookings by category</p>

          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={adminPopularActivities}
                layout="vertical"
                margin={{ top: 4, right: 12, bottom: 0, left: 0 }}
              >
                <CartesianGrid horizontal={false} stroke="var(--color-line)" />
                <XAxis
                  type="number"
                  domain={[0, maxBookings]}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: 'var(--color-muted)' }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  width={110}
                  tick={{ fontSize: 11, fill: 'var(--color-muted)' }}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--color-surface-alt)' }} />
                <Bar dataKey="bookings" name="Bookings" radius={[0, 6, 6, 0]}>
                  {adminPopularActivities.map((a) => (
                    <Cell key={a.id} fill={a.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="mt-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-display text-base font-semibold text-fg">Spending overview</h2>
          <p className="text-xs text-muted">Total booked spend over time</p>
        </div>

        <div className="mt-4 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend} margin={{ top: 4, right: 4, bottom: 0, left: 8 }}>
              <defs>
                <linearGradient id="gSpend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-sunset-500, #ff7a59)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--color-sunset-500, #ff7a59)" stopOpacity={0} />
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
                width={64}
                tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`}
                tick={{ fontSize: 11, fill: 'var(--color-muted)' }}
              />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="spend"
                name="Spend"
                stroke="#ff7a59"
                strokeWidth={2}
                fill="url(#gSpend)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}

export default AdminAnalytics
