import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { Bookmark, CalendarDays, Heart, MapPin, MessageCircle } from 'lucide-react'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import { formatCurrency } from '../../utils/formatters'
import { staggerItem } from '../../utils/motionVariants'
import { cn } from '../../utils/cn'

export function ItineraryPostCard({ post, liked, saved, onLike, onSave }) {
  return (
    <motion.div variants={staggerItem} whileHover={{ y: -5 }} transition={{ duration: 0.25 }}>
      <Card className="group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lift">
        <Link to={`/trips/${post.id}`} className="relative block h-40 overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08161f]/85 via-transparent to-transparent" />

          <span className="absolute right-3 top-3 rounded-full bg-white/20 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {post.days} days
          </span>

          <p className="absolute inset-x-0 bottom-0 flex items-center gap-1.5 p-3 text-xs text-white/90">
            <MapPin className="size-3.5 shrink-0" />
            <span className="truncate">{post.destinations.join(' • ')}</span>
          </p>
        </Link>

        <div className="flex flex-1 flex-col gap-3 p-4">
          <div>
            <h3 className="font-display text-base font-semibold text-fg">{post.title}</h3>
            <div className="mt-2 flex items-center gap-2">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-500/15 text-[10px] font-semibold text-brand-600 dark:text-brand-400">
                {post.authorInitials}
              </span>
              <span className="truncate text-xs text-muted">{post.author}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <Badge key={tag} tone="teal">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="mt-auto flex items-center justify-between gap-2 border-t border-line pt-3">
            <span className="flex items-center gap-1.5 text-xs text-muted">
              <CalendarDays className="size-3.5" />
              <span className="font-semibold text-fg">{formatCurrency(post.budget)}</span>
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onLike(post.id)}
                aria-pressed={liked}
                aria-label="Like itinerary"
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium transition-colors',
                  liked
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-muted hover:text-fg',
                )}
              >
                <Heart className={cn('size-3.5', liked && 'fill-current')} />
                {post.likes + (liked ? 1 : 0)}
              </button>

              <button
                type="button"
                onClick={() => onSave(post.id)}
                aria-pressed={saved}
                aria-label="Save itinerary"
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium transition-colors',
                  saved ? 'text-brand-600 dark:text-brand-400' : 'text-muted hover:text-fg',
                )}
              >
                <Bookmark className={cn('size-3.5', saved && 'fill-current')} />
                {post.saves + (saved ? 1 : 0)}
              </button>

              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs text-muted">
                <MessageCircle className="size-3.5" />
                {post.comments}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default ItineraryPostCard
