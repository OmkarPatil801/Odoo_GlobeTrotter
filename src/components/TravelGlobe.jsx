import { Component, Suspense, lazy, useMemo, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { motion } from 'motion/react'
import { ArrowUpRight, Globe2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cities, globeDestinations, globeRoute } from '../data/mockData'
import Card from './ui/Card'

const SPLINE_SCENE_URL = import.meta.env.VITE_SPLINE_SCENE_URL
const Spline = SPLINE_SCENE_URL ? lazy(() => import('@splinetool/react-spline')) : null

const cityBlurbs = Object.fromEntries(cities.map((city) => [city.name, city]))

const RING_RADIUS = { 1: 30, 2: 42 }

function polarToPercent(angleDeg, radiusPercent) {
  const rad = (angleDeg * Math.PI) / 180
  return {
    x: 50 + radiusPercent * Math.cos(rad),
    y: 50 + radiusPercent * Math.sin(rad),
  }
}

class SplineErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}

function FallbackGlobe({ activeId, onSelect, markers, route }) {
  const scope = useRef(null)
  const highlightRef = useRef(null)

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReducedMotion) return

      gsap.to(highlightRef.current, {
        rotate: 360,
        duration: 18,
        repeat: -1,
        ease: 'none',
        transformOrigin: '50% 50%',
      })
    },
    { scope },
  )

  const routePoints = route.map((id) => markers.find((m) => m.id === id)).filter(Boolean)

  return (
    <div ref={scope} className="relative aspect-square w-full">
      <div
        className="absolute inset-[14%] overflow-hidden rounded-full"
        style={{
          background: 'radial-gradient(circle at 50% 50%, #16243c, #0a0d15 70%)',
          boxShadow: '0 0 60px -10px rgba(255,122,89,0.3), inset 0 0 50px rgba(0,0,0,0.6)',
        }}
      >
        <div ref={highlightRef} className="absolute inset-0">
          <div
            className="absolute left-[8%] top-[10%] size-[55%] rounded-full opacity-70 blur-md"
            style={{
              background:
                'radial-gradient(circle, rgba(255,255,255,0.5), rgba(255,122,89,0.3) 40%, transparent 70%)',
            }}
          />
        </div>
      </div>

      <div className="absolute inset-[5%] rounded-full border border-white/10" />
      <div className="absolute inset-[19%] rounded-full border border-white/10" />

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" fill="none">
        {routePoints.length > 1 &&
          routePoints.slice(0, -1).map((point, i) => {
            const next = routePoints[i + 1]
            return (
              <line
                key={point.id}
                x1={point.x}
                y1={point.y}
                x2={next.x}
                y2={next.y}
                stroke="var(--color-brand-400)"
                strokeWidth="0.4"
                strokeDasharray="2 2"
                opacity="0.7"
              >
                <animate attributeName="stroke-dashoffset" from="0" to="-8" dur="1.2s" repeatCount="indefinite" />
              </line>
            )
          })}
      </svg>

      {markers.map((marker) => {
        const isActive = marker.id === activeId
        return (
          <motion.button
            key={marker.id}
            type="button"
            onClick={() => onSelect(marker.id)}
            className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5"
            style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
          >
            <span
              className={`block size-2.5 rounded-full transition-shadow ${
                isActive ? 'bg-brand-300 shadow-glow' : 'bg-brand-400/80'
              }`}
            />
            <span
              className={`whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm transition-colors ${
                isActive
                  ? 'border-brand-400/50 bg-brand-500/20 text-brand-200'
                  : 'border-white/10 bg-[#08161f]/70 text-white opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'
              }`}
            >
              {marker.name}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}

export function TravelGlobe({ className }) {
  const [activeId, setActiveId] = useState(null)

  const markers = useMemo(
    () =>
      globeDestinations.map((dest) => ({
        ...dest,
        ...polarToPercent(dest.angle, RING_RADIUS[dest.ring]),
      })),
    [],
  )

  const activeMarker = markers.find((m) => m.id === activeId)
  const activeCity = activeMarker ? cityBlurbs[activeMarker.name] : null

  const fallback = <FallbackGlobe activeId={activeId} onSelect={setActiveId} markers={markers} route={globeRoute} />

  return (
    <div className={className}>
      <Card className="relative overflow-hidden p-6 sm:p-8">
        <div className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-muted">
          <Globe2 className="size-3.5 text-brand-500" />
          Explore the world
        </div>

        {Spline ? (
          <SplineErrorBoundary fallback={fallback}>
            <Suspense fallback={fallback}>
              <div className="aspect-square w-full overflow-hidden rounded-2xl">
                <Spline scene={SPLINE_SCENE_URL} />
              </div>
            </Suspense>
          </SplineErrorBoundary>
        ) : (
          fallback
        )}

        <div className="mt-5 min-h-16 rounded-xl border border-line bg-surface-alt p-4">
          {activeCity ? (
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-display text-sm font-semibold text-fg">
                  {activeCity.name}, {activeCity.country}
                </p>
                <p className="mt-0.5 text-xs text-muted">{activeCity.description}</p>
              </div>
              <Link
                to="/search/cities"
                className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400"
              >
                Explore
                <ArrowUpRight className="size-3.5" />
              </Link>
            </div>
          ) : (
            <p className="text-xs text-muted">Tap a marker to preview a destination.</p>
          )}
        </div>
      </Card>
    </div>
  )
}

export default TravelGlobe
