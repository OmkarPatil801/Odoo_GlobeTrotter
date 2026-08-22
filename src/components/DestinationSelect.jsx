import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, ChevronDown, MapPin } from 'lucide-react'
import { cn } from '../utils/cn'

export function DestinationSelect({ destinations, value, onChange, id, invalid }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    function onClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open])

  const selected = destinations.find((d) => d.id === value)

  return (
    <div ref={ref} className="relative">
      <button
        id={id}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className={cn(
          'flex w-full items-center justify-between gap-2 rounded-full border bg-card px-4 py-3 text-sm transition-colors',
          invalid ? 'border-brand-500' : 'border-line hover:border-brand-500/40',
        )}
      >
        <span className="flex items-center gap-2 truncate">
          <MapPin className="size-4 shrink-0 text-muted" />
          {selected ? (
            <span className="truncate text-fg">
              {selected.name}
              <span className="text-muted"> · {selected.country}</span>
            </span>
          ) : (
            <span className="text-muted">Choose a destination</span>
          )}
        </span>
        <ChevronDown
          className={cn('size-4 shrink-0 text-muted transition-transform', open && 'rotate-180')}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            className="absolute left-0 top-full z-30 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-line bg-card p-1 shadow-lift"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            {destinations.map((destination) => (
              <li key={destination.id}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(destination.id)
                    setOpen(false)
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-surface-alt"
                >
                  <img
                    src={destination.image}
                    alt=""
                    className="size-9 shrink-0 rounded-lg object-cover"
                    loading="lazy"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-fg">{destination.name}</span>
                    <span className="block truncate text-xs text-muted">{destination.country}</span>
                  </span>
                  {destination.id === value && <Check className="size-4 shrink-0 text-brand-500" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

export default DestinationSelect
