import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn'

export function SectionHeading({ eyebrow, title, subtitle, actionLabel, actionTo, className }) {
  return (
    <div className={cn('flex flex-wrap items-end justify-between gap-4', className)}>
      <div>
        {eyebrow && (
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-2xl font-semibold text-fg sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-1.5 max-w-xl text-sm text-muted">{subtitle}</p>}
      </div>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-brand-500"
        >
          {actionLabel}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  )
}

export default SectionHeading
