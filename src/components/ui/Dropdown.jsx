import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '../../utils/cn'

export function Dropdown({ label, icon: Icon, options, value, onChange, className }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return

    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const selected = options.find((option) => option.value === value)

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 rounded-full border border-line bg-card px-4 py-2.5 text-sm text-fg transition-colors hover:border-brand-500/40"
      >
        <span className="flex items-center gap-2 truncate">
          {Icon && <Icon className="size-4 shrink-0 text-muted" />}
          <span className="truncate">
            <span className="text-muted">{label}: </span>
            {selected?.label ?? 'Any'}
          </span>
        </span>
        <ChevronDown
          className={cn('size-4 shrink-0 text-muted transition-transform', open && 'rotate-180')}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            className="absolute left-0 top-full z-30 mt-2 min-w-full overflow-hidden rounded-xl border border-line bg-card p-1 shadow-lift"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value)
                    setOpen(false)
                  }}
                  className="flex w-full items-center justify-between gap-4 whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm text-fg transition-colors hover:bg-surface-alt"
                >
                  {option.label}
                  {option.value === value && <Check className="size-3.5 text-brand-500" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Dropdown
