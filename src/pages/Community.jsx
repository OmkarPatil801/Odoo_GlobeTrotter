import { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { Bookmark, Search, Share2, Sparkles, Users, X } from 'lucide-react'
import PageContainer from '../components/ui/PageContainer'
import SectionHeading from '../components/ui/SectionHeading'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Dropdown from '../components/ui/Dropdown'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import ItineraryPostCard from '../components/community/ItineraryPostCard'
import { staggerContainer } from '../utils/motionVariants'
import {
  communityDurationOptions,
  communitySortOptions,
  communityTagOptions,
  communityTopCreators,
} from '../data/mockData'
import api from '../services/api'
import { cn } from '../utils/cn'
import { communityItineraries as seedItineraries } from '../data/mockData'

const durationBand = { short: [0, 4], medium: [5, 8], long: [9, 99] }

const feedTabs = [
  { value: 'all', label: 'All itineraries' },
  { value: 'trending', label: 'Trending' },
  { value: 'saved', label: 'Saved' },
]

function Community() {
  const [communityItineraries, setCommunityItineraries] = useState(seedItineraries)
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState('all')
  const [tag, setTag] = useState('all')
  const [duration, setDuration] = useState('all')
  const [sortBy, setSortBy] = useState('popular')
  const [likedIds, setLikedIds] = useState([])
  const [savedIds, setSavedIds] = useState([])
  
  useEffect(() => {
    api.get('/community/posts')
      .then(res => {
        const posts = res.data.data || []
        const mappedPosts = posts.map(p => ({
          id: p.id,
          title: p.title || 'Untitled Itinerary',
          author: p.author || 'Anonymous',
          authorInitials: 'AN',
          destinations: p.destinations || [],
          days: p.days || 1,
          budget: p.budget || 0,
          likes: p.likes || 0,
          saves: p.saves || 0,
          comments: p.comments || 0,
          tags: p.tags || [],
          coverImage: p.imageUrl || null,
          publishedAt: p.createdAt || new Date().toISOString()
        }))
        setCommunityItineraries(mappedPosts)
      })
      .catch(() => {})
  }, [])

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase()
    let list = communityItineraries

    if (tab === 'trending') list = list.filter((p) => p.likes >= 300)
    if (tab === 'saved') list = list.filter((p) => savedIds.includes(p.id))

    if (needle) {
      list = list.filter((p) =>
        [p.title, p.author, ...p.destinations, ...p.tags].some((f) =>
          f.toLowerCase().includes(needle),
        ),
      )
    }
    if (tag !== 'all') list = list.filter((p) => p.tags.includes(tag))
    if (duration !== 'all') {
      const [min, max] = durationBand[duration]
      list = list.filter((p) => p.days >= min && p.days <= max)
    }

    const out = [...list]
    if (sortBy === 'saved') return out.sort((a, b) => b.saves - a.saves)
    if (sortBy === 'recent')
      return out.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    if (sortBy === 'budget-low') return out.sort((a, b) => a.budget - b.budget)
    return out.sort((a, b) => b.likes - a.likes)
  }, [query, tab, tag, duration, sortBy, savedIds])

  const toggle = (setter) => (id) =>
    setter((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const clearFilters = () => {
    setQuery('')
    setTag('all')
    setDuration('all')
  }

  const filtersActive = query !== '' || tag !== 'all' || duration !== 'all'

  const stats = [
    { label: 'Shared itineraries', value: communityItineraries.length, icon: Share2 },
    { label: 'Travelers', value: '12.4k', icon: Users },
    { label: 'You saved', value: savedIds.length, icon: Bookmark },
  ]

  return (
    <div className="pb-24">
      <PageContainer className="pt-10 sm:pt-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Community"
            title="Explore Public Itineraries"
            subtitle="Real trips shared by travelers — copy one, or make it your own."
          />
          <Button to="/trips" icon={Share2} className="shrink-0">
            Share your trip
          </Button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] xl:gap-8">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {feedTabs.map((t) => {
                const active = tab === t.value
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTab(t.value)}
                    className={cn(
                      'relative rounded-full px-4 py-2 text-sm font-medium transition-colors',
                      active ? 'text-white' : 'text-muted hover:text-fg',
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="community-tab"
                        className="absolute inset-0 rounded-full bg-brand-500"
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      />
                    )}
                    <span className="relative">
                      {t.label}
                      {t.value === 'saved' && savedIds.length > 0 && ` (${savedIds.length})`}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))]">
              <Input
                icon={Search}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search itineraries, cities, or creators…"
                aria-label="Search itineraries"
              />
              <Dropdown label="Tag" options={communityTagOptions} value={tag} onChange={setTag} />
              <Dropdown
                label="Length"
                options={communityDurationOptions}
                value={duration}
                onChange={setDuration}
              />
              <Dropdown
                label="Sort"
                options={communitySortOptions}
                value={sortBy}
                onChange={setSortBy}
              />
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted">
                <span className="font-semibold text-fg">{results.length}</span>{' '}
                {results.length === 1 ? 'itinerary' : 'itineraries'}
              </p>
              {filtersActive && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:text-fg"
                >
                  <X className="size-3.5" />
                  Clear filters
                </button>
              )}
            </div>

            {results.length === 0 ? (
              <EmptyState
                icon={Sparkles}
                title={tab === 'saved' ? 'Nothing saved yet' : 'No itineraries match'}
                description={
                  tab === 'saved'
                    ? 'Tap the bookmark on any itinerary to save it here.'
                    : 'Try a broader search or clear your filters.'
                }
                action={
                  filtersActive && (
                    <Button size="sm" variant="secondary" onClick={clearFilters}>
                      Clear filters
                    </Button>
                  )
                }
                className="mt-8"
              />
            ) : (
              <motion.div
                key={`${tab}-${tag}-${duration}-${sortBy}`}
                className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {results.map((post) => (
                  <ItineraryPostCard
                    key={post.id}
                    post={post}
                    liked={likedIds.includes(post.id)}
                    saved={savedIds.includes(post.id)}
                    onLike={toggle(setLikedIds)}
                    onSave={toggle(setSavedIds)}
                  />
                ))}
              </motion.div>
            )}
          </div>

          <aside className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
            <Card className="p-5">
              <h3 className="font-display text-base font-semibold text-fg">Community</h3>
              <ul className="mt-3 flex flex-col gap-3">
                {stats.map((stat) => (
                  <li key={stat.label} className="flex items-center gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-500/15 text-brand-600 dark:text-brand-400">
                      <stat.icon className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm text-muted">{stat.label}</span>
                    <span className="shrink-0 font-display text-sm font-semibold text-fg">
                      {stat.value}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-5">
              <h3 className="font-display text-base font-semibold text-fg">Top creators</h3>
              <ul className="mt-3 flex flex-col gap-3">
                {communityTopCreators.map((creator) => (
                  <li key={creator.id} className="flex items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-500/15 text-xs font-semibold text-brand-600 dark:text-brand-400">
                      {creator.initials}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-fg">{creator.name}</span>
                      <span className="block truncate text-xs text-muted">
                        {creator.trips} trips · {creator.followers} followers
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-5">
              <h3 className="font-display text-base font-semibold text-fg">Popular tags</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {communityTagOptions
                  .filter((t) => t.value !== 'all')
                  .map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setTag(tag === t.value ? 'all' : t.value)}
                      className={cn(
                        'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                        tag === t.value
                          ? 'border-brand-500 bg-brand-500 text-white'
                          : 'border-line bg-card text-muted hover:text-fg',
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
              </div>
            </Card>
          </aside>
        </div>
      </PageContainer>
    </div>
  )
}

export default Community
