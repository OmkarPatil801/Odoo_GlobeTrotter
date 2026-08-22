import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ArrowLeft, TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import PageContainer from '../components/ui/PageContainer'
import SectionHeading from '../components/ui/SectionHeading'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Dropdown from '../components/ui/Dropdown'
import EmptyState from '../components/ui/EmptyState'
import { formatCurrency, formatDate } from '../utils/formatters'
import { fadeSlideUp, staggerContainer, staggerItem } from '../utils/motionVariants'
import {
  budgetCategories,
  budgetDailySpend,
  budgetExpenseFilters,
  budgetExpenses,
  budgetStatusFilters,
  tripDetail,
} from '../data/mockData'

const categoryById = Object.fromEntries(budgetCategories.map((c) => [c.id, c]))

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-line bg-card px-3 py-2 shadow-lift">
      <p className="text-xs font-medium text-fg">{label ?? payload[0].name}</p>
      <p className="text-xs text-muted">{formatCurrency(payload[0].value)}</p>
    </div>
  )
}

function BudgetBreakdown() {
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('all')

  const totals = useMemo(() => {
    const planned = budgetCategories.reduce((s, c) => s + c.planned, 0)
    const spent = budgetCategories.reduce((s, c) => s + c.spent, 0)
    const days = budgetDailySpend.length
    return {
      planned,
      spent,
      remaining: planned - spent,
      percent: Math.round((spent / planned) * 100),
      perDay: Math.round(spent / days),
    }
  }, [])

  const expenses = useMemo(() => {
    let list = budgetExpenses
    if (category !== 'all') list = list.filter((e) => e.categoryId === category)
    if (status !== 'all') list = list.filter((e) => (status === 'paid' ? e.paid : !e.paid))
    return [...list].sort((a, b) => new Date(a.date) - new Date(b.date))
  }, [category, status])

  const filteredTotal = expenses.reduce((s, e) => s + e.amount, 0)

  const stats = [
    { label: 'Total planned', value: formatCurrency(totals.planned), icon: Wallet, tone: 'text-fg' },
    { label: 'Spent so far', value: formatCurrency(totals.spent), icon: TrendingUp, tone: 'text-fg' },
    {
      label: 'Remaining',
      value: formatCurrency(totals.remaining),
      icon: TrendingDown,
      tone: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      label: 'Avg per day',
      value: formatCurrency(totals.perDay),
      icon: Wallet,
      tone: 'text-fg',
    },
  ]

  return (
    <div className="pb-24">
      <PageContainer className="pt-10 sm:pt-14">
        <Button
          to={`/trips/${tripDetail.id}`}
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
            title="Budget & Cost Breakdown"
            subtitle="Where the money is going, category by category."
          />
        </motion.div>

        <motion.div
          className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={staggerItem}>
              <Card className="flex items-center gap-3.5 p-5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/15 text-brand-600 dark:text-brand-400">
                  <stat.icon className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wide text-muted">{stat.label}</p>
                  <p className={`mt-0.5 truncate font-display text-lg font-semibold ${stat.tone}`}>
                    {stat.value}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <Card className="mt-5 p-5 sm:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm text-muted">
              <span className="font-semibold text-fg">{formatCurrency(totals.spent)}</span> of{' '}
              {formatCurrency(totals.planned)} used
            </p>
            <p className="font-display text-lg font-semibold text-brand-600 dark:text-brand-400">
              {totals.percent}%
            </p>
          </div>
          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-surface-alt">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600"
              initial={{ width: 0 }}
              animate={{ width: `${totals.percent}%` }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </Card>

        <div className="mt-6 grid gap-5 lg:grid-cols-[22rem_minmax(0,1fr)]">
          <Card className="p-5 sm:p-6">
            <h3 className="font-display text-base font-semibold text-fg">By category</h3>

            <div className="mt-4 h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={budgetCategories}
                    dataKey="planned"
                    nameKey="name"
                    innerRadius={54}
                    outerRadius={82}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {budgetCategories.map((c) => (
                      <Cell key={c.id} fill={c.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <ul className="mt-4 flex flex-col gap-3">
              {budgetCategories.map((c) => {
                const pct = Math.round((c.spent / c.planned) * 100)
                return (
                  <li key={c.id}>
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="flex min-w-0 items-center gap-2">
                        <span
                          className="size-2.5 shrink-0 rounded-full"
                          style={{ background: c.color }}
                        />
                        <span className="truncate text-fg">{c.name}</span>
                      </span>
                      <span className="shrink-0 text-xs text-muted">
                        {formatCurrency(c.spent)} / {formatCurrency(c.planned)}
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-alt">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: c.color }}
                      />
                    </div>
                  </li>
                )
              })}
            </ul>
          </Card>

          <div className="flex flex-col gap-5">
            <Card className="p-5 sm:p-6">
              <h3 className="font-display text-base font-semibold text-fg">Spend by day</h3>
              <div className="mt-4 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={budgetDailySpend} margin={{ top: 4, right: 4, bottom: 0, left: -8 }}>
                    <XAxis
                      dataKey="label"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: 'var(--color-muted)' }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      width={52}
                      tick={{ fontSize: 11, fill: 'var(--color-muted)' }}
                      tickFormatter={(v) => `₹${v / 1000}k`}
                    />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--color-surface-alt)' }} />
                    <Bar dataKey="amount" radius={[6, 6, 0, 0]} fill="var(--color-brand-500)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="flex flex-col overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-5">
                <div>
                  <h3 className="font-display text-base font-semibold text-fg">Expenses</h3>
                  <p className="mt-0.5 text-xs text-muted">
                    {expenses.length} item{expenses.length === 1 ? '' : 's'} ·{' '}
                    <span className="font-semibold text-fg">{formatCurrency(filteredTotal)}</span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Dropdown
                    label="Category"
                    options={budgetExpenseFilters}
                    value={category}
                    onChange={setCategory}
                    className="min-w-44"
                  />
                  <Dropdown
                    label="Status"
                    options={budgetStatusFilters}
                    value={status}
                    onChange={setStatus}
                    className="min-w-36"
                  />
                </div>
              </div>

              {expenses.length === 0 ? (
                <EmptyState
                  icon={Wallet}
                  title="No expenses match"
                  description="Try a different category or status filter."
                  className="m-5 border-0"
                />
              ) : (
                <ul className="flex flex-col">
                  {expenses.map((expense, i) => {
                    const cat = categoryById[expense.categoryId]
                    return (
                      <motion.li
                        key={expense.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: i * 0.03 }}
                        className={`flex items-center gap-4 px-5 py-3.5 ${i > 0 ? 'border-t border-line' : ''}`}
                      >
                        <span
                          className="size-2.5 shrink-0 rounded-full"
                          style={{ background: cat.color }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-fg">{expense.title}</p>
                          <p className="mt-0.5 text-xs text-muted">
                            {cat.name} · {expense.city} · {formatDate(expense.date)}
                          </p>
                        </div>
                        <Badge tone={expense.paid ? 'success' : 'warning'}>
                          {expense.paid ? 'Paid' : 'Due'}
                        </Badge>
                        <span className="w-24 shrink-0 text-right text-sm font-semibold text-fg">
                          {formatCurrency(expense.amount)}
                        </span>
                      </motion.li>
                    )
                  })}
                </ul>
              )}
            </Card>
          </div>
        </div>
      </PageContainer>
    </div>
  )
}

export default BudgetBreakdown
