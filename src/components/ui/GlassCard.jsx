import { cn } from '../../utils/cn'

export function GlassCard({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/25 bg-white/15 shadow-lift backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default GlassCard
