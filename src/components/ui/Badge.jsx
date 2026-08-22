import { cn } from '../../utils/cn'

const toneClasses = {
  neutral: 'bg-surface-alt text-muted border-line',
  brand: 'bg-brand-500/15 text-brand-600 border-brand-500/25 dark:text-brand-300',
  teal: 'bg-teal-500/15 text-teal-600 border-teal-500/25 dark:text-teal-400',
  success: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/25 dark:text-emerald-300',
  info: 'bg-sky-500/15 text-sky-700 border-sky-500/25 dark:text-sky-300',
  warning: 'bg-amber-500/15 text-amber-700 border-amber-500/25 dark:text-amber-300',
}

export function Badge({ tone = 'neutral', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium',
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export default Badge
