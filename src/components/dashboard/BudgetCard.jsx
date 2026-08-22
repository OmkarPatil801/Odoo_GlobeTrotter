import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Wallet } from 'lucide-react'
import Card from '../ui/Card'
import { formatCurrency } from '../../utils/formatters'

export function BudgetCard({ summary, className }) {
  const barRef = useRef(null)
  const scope = useRef(null)
  const spentPercent = Math.min(100, Math.round((summary.spent / summary.totalPlanned) * 100))

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      gsap.fromTo(
        barRef.current,
        { width: '0%' },
        {
          width: `${spentPercent}%`,
          duration: prefersReducedMotion ? 0 : 1.2,
          ease: 'power3.out',
        },
      )
    },
    { scope, dependencies: [spentPercent] },
  )

  return (
    <Card ref={scope} className={className}>
      <div className="p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-brand-500/15 text-brand-600 dark:text-brand-400">
            <Wallet className="size-5" />
          </span>
          <div>
            <p className="text-sm text-muted">Total planned across all trips</p>
            <p className="font-display text-2xl font-semibold text-fg">
              {formatCurrency(summary.totalPlanned)}
            </p>
          </div>
        </div>

        <div className="mt-6 h-2.5 w-full overflow-hidden rounded-full bg-surface-alt">
          <div
            ref={barRef}
            className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600"
          />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Spent</p>
            <p className="mt-1 font-display text-lg font-semibold text-fg">
              {formatCurrency(summary.spent)}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Remaining</p>
            <p className="mt-1 font-display text-lg font-semibold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(summary.remaining)}
            </p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="text-xs uppercase tracking-wide text-muted">Used</p>
            <p className="mt-1 font-display text-lg font-semibold text-brand-600 dark:text-brand-400">{spentPercent}%</p>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default BudgetCard
