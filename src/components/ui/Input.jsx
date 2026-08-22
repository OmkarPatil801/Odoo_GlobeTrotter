import { cn } from '../../utils/cn'

export function Input({ icon: Icon, className, containerClassName, ...props }) {
  return (
    <div className={cn('relative flex items-center', containerClassName)}>
      {Icon && (
        <Icon className="pointer-events-none absolute left-4 size-4 text-muted" strokeWidth={2} />
      )}
      <input
        className={cn(
          'w-full rounded-full border border-line bg-card py-3 text-sm text-fg placeholder:text-muted outline-none transition-colors focus:border-brand-500/60',
          Icon ? 'pl-11 pr-4' : 'px-4',
          className,
        )}
        {...props}
      />
    </div>
  )
}

export default Input
