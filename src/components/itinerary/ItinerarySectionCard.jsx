import { AnimatePresence, motion } from 'motion/react'
import { CalendarDays, ChevronDown, Pencil, Trash2, Wallet } from 'lucide-react'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import { formatCurrency, formatDate, formatDateRange } from '../../utils/formatters'
import { itinerarySectionTypes } from '../../data/mockData'
import { cn } from '../../utils/cn'

const typeTone = {
  travel: 'info',
  hotel: 'teal',
  activity: 'brand',
  restaurant: 'warning',
  other: 'neutral',
}

function typeLabel(value) {
  return itinerarySectionTypes.find((t) => t.value === value)?.label ?? 'Other'
}

export function ItinerarySectionCard({ section, index, expanded, onToggle, onEdit, onDelete }) {
  const dateText =
    section.startDate === section.endDate
      ? formatDate(section.startDate)
      : formatDateRange(section.startDate, section.endDate)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="overflow-hidden">
        <div className="flex items-stretch">
          {section.image && (
            <div className="hidden w-40 shrink-0 overflow-hidden sm:block">
              <img
                src={section.image}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <button
              type="button"
              onClick={() => onToggle(section.id)}
              aria-expanded={expanded}
              className="flex w-full items-start gap-4 p-5 text-left"
            >
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                  Section {index + 1}
                </p>
                <h3 className="mt-1 truncate font-display text-lg font-semibold text-fg">
                  {section.title}
                </h3>

                <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <Badge tone={typeTone[section.type]}>{typeLabel(section.type)}</Badge>
                  <span className="flex items-center gap-1.5 text-xs text-muted">
                    <CalendarDays className="size-3.5" />
                    {dateText}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-fg">
                    <Wallet className="size-3.5 text-muted" />
                    {formatCurrency(section.budget)}
                  </span>
                </div>
              </div>

              <ChevronDown
                className={cn(
                  'mt-1 size-5 shrink-0 text-muted transition-transform',
                  expanded && 'rotate-180',
                )}
              />
            </button>

            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  className="overflow-hidden"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="border-t border-line px-5 py-4">
                    <p className="text-sm text-muted">{section.description}</p>

                    <div className="mt-4 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(section.id)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-3.5 py-1.5 text-xs font-medium text-fg transition-colors hover:border-brand-500/50"
                      >
                        <Pencil className="size-3.5" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(section.id)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-3.5 py-1.5 text-xs font-medium text-rose-600 transition-colors hover:border-rose-500/50 dark:text-rose-400"
                      >
                        <Trash2 className="size-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default ItinerarySectionCard
