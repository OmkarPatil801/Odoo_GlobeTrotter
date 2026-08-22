import { Component, Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { ArrowUpRight, Globe2, Plane } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cities, globeDestinations, globeRoutes } from '../data/mockData'
import Card from './ui/Card'

const SPLINE_SCENE_URL = import.meta.env.VITE_SPLINE_SCENE_URL
const Spline = SPLINE_SCENE_URL ? lazy(() => import('@splinetool/react-spline')) : null

const cityBlurbs = Object.fromEntries(cities.map((city) => [city.name, city]))

// Globe geometry, in the SVG's 0..200 coordinate space.
const CX = 100
const CY = 100
const R = 78

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

/* -------------------------------------------------------------------------
 * Simplified equirectangular land outlines (viewBox 0 0 360 180,
 * x = lon + 180, y = 90 - lat). Drawn twice side by side and scrolled so the
 * Earth reads as continuously rotating inside the sphere clip.
 * ---------------------------------------------------------------------- */
const LAND = [
  // North America
  '15,25 40,20 85,20 110,30 120,43 100,65 83,74 75,70 55,50 50,35 15,30',
  // Greenland
  '122,22 125,10 160,12 150,18 135,30',
  // South America
  '103,82 120,80 145,95 142,113 122,125 110,145 105,135 99,95',
  // Europe
  '171,53 170,47 180,40 185,32 208,20 220,30 220,45 208,50 190,46',
  // Africa
  '163,75 190,55 212,58 223,78 231,78 220,95 215,115 200,125 195,120 192,95 189,86 172,85',
  // Asia
  '220,45 240,20 280,12 320,18 325,30 315,45 302,60 285,80 275,85 258,82 250,65 235,60 225,50',
  // South-east Asia / Indonesia
  '288,86 300,84 312,90 300,95 290,92',
  // Australia
  '293,112 310,102 322,101 330,115 326,128 310,122 295,125',
  // Antarctica
  '0,172 360,172 360,180 0,180',
]

function LandMass({ offset }) {
  return (
    <g transform={`translate(${offset} 0)`}>
      {LAND.map((points, i) => (
        <polygon key={i} points={points} fill="url(#gt-land)" />
      ))}
    </g>
  )
}

/**
 * Orthographic projection of a lat/lon onto the visible face of the globe.
 * `spin` is the current rotation of the Earth in degrees.
 */
function project(lat, lon, spin) {
  const latRad = (lat * Math.PI) / 180
  const lonRad = (((lon + spin + 180) % 360) - 180) * (Math.PI / 180)
  return {
    x: CX + R * Math.cos(latRad) * Math.sin(lonRad),
    y: CY - R * Math.sin(latRad),
    // cos of the angle from the centre of the visible face: > 0 means
    // the point is on the near side of the sphere.
    front: Math.cos(latRad) * Math.cos(lonRad),
  }
}

function arcPath(a, b) {
  const mx = (a.x + b.x) / 2
  const my = (a.y + b.y) / 2
  const dist = Math.hypot(b.x - a.x, b.y - a.y)
  // Lift the control point away from the globe centre so the route
  // arcs over the surface instead of cutting through it.
  const dx = mx - CX
  const dy = my - CY
  const len = Math.hypot(dx, dy) || 1
  const lift = 12 + dist * 0.28
  const cx = mx + (dx / len) * lift
  const cy = my + (dy / len) * lift
  return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`
}

function EarthGlobe({ activeId, onSelect }) {
  const [spin, setSpin] = useState(0)
  const frame = useRef()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let last = performance.now()
    const tick = (now) => {
      const dt = now - last
      last = now
      // ~55 seconds per full revolution.
      setSpin((s) => (s + dt * 0.0065) % 360)
      frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame.current)
  }, [])

  const markers = useMemo(
    () => globeDestinations.map((d) => ({ ...d, ...project(d.lat, d.lon, spin) })),
    [spin],
  )
  const byId = useMemo(() => Object.fromEntries(markers.map((m) => [m.id, m])), [markers])

  const routes = globeRoutes
    .map(([from, to], i) => ({ id: `${from}-${to}`, i, a: byId[from], b: byId[to] }))
    .filter((r) => r.a && r.b && (r.a.front > -0.15 || r.b.front > -0.15))

  // Map scroll offset: one full revolution == 360 map units.
  const mapOffset = -(spin % 360)

  return (
    <div className="relative aspect-square w-full">
      <svg viewBox="0 0 200 200" className="h-full w-full overflow-visible">
        <defs>
          <radialGradient id="gt-ocean" cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#4aa9ff" />
            <stop offset="45%" stopColor="#1668c4" />
            <stop offset="100%" stopColor="#07254d" />
          </radialGradient>
          <linearGradient id="gt-land" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5fd08a" />
            <stop offset="100%" stopColor="#2f9c62" />
          </linearGradient>
          <radialGradient id="gt-shade" cx="35%" cy="30%" r="78%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="45%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="85%" stopColor="#00060f" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#00060f" stopOpacity="0.8" />
          </radialGradient>
          <radialGradient id="gt-atmo" cx="50%" cy="50%" r="50%">
            <stop offset="72%" stopColor="#38bdf8" stopOpacity="0" />
            <stop offset="92%" stopColor="#38bdf8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </radialGradient>
          <clipPath id="gt-sphere">
            <circle cx={CX} cy={CY} r={R} />
          </clipPath>
          <filter id="gt-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="1.6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Atmosphere */}
        <circle cx={CX} cy={CY} r={R + 16} fill="url(#gt-atmo)" />

        {/* Ocean */}
        <circle cx={CX} cy={CY} r={R} fill="url(#gt-ocean)" />

        {/* Rotating continents */}
        <g clipPath="url(#gt-sphere)" opacity="0.92">
          <g transform={`translate(${CX - R} ${CY - R * 0.86}) scale(${(2 * R) / 360} ${(2 * R * 0.86) / 180})`}>
            <g transform={`translate(${mapOffset} 0)`}>
              <LandMass offset={0} />
              <LandMass offset={360} />
              <LandMass offset={-360} />
            </g>
          </g>
        </g>

        {/* Graticule */}
        <g clipPath="url(#gt-sphere)" fill="none" stroke="#ffffff" strokeOpacity="0.14" strokeWidth="0.5">
          {[-60, -30, 0, 30, 60].map((lat) => (
            <line
              key={lat}
              x1={CX - R}
              x2={CX + R}
              y1={CY - (R * lat) / 90}
              y2={CY - (R * lat) / 90}
            />
          ))}
          {[0.25, 0.55, 0.85].map((k) => (
            <g key={k}>
              <ellipse cx={CX} cy={CY} rx={R * k} ry={R} />
            </g>
          ))}
        </g>

        {/* Sphere shading + rim */}
        <circle cx={CX} cy={CY} r={R} fill="url(#gt-shade)" />
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="#7dd3fc" strokeOpacity="0.45" strokeWidth="0.8" />

        {/* Flight routes */}
        <g fill="none" filter="url(#gt-glow)">
          {routes.map((r) => {
            const visible = Math.max(0, (r.a.front + r.b.front) / 2 + 0.35)
            return (
              <g key={r.id} opacity={Math.min(1, visible)}>
                <path d={arcPath(r.a, r.b)} stroke="var(--color-brand-400, #ff9f7a)" strokeWidth="0.9" strokeOpacity="0.55" />
                <path
                  d={arcPath(r.a, r.b)}
                  stroke="#fff1e6"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                  strokeDasharray="4 46"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="50"
                    to="0"
                    dur={`${2.6 + (r.i % 4) * 0.5}s`}
                    repeatCount="indefinite"
                  />
                </path>
              </g>
            )
          })}
        </g>
      </svg>

      {/* Destination markers */}
      {markers.map((marker) => {
        const isActive = marker.id === activeId
        const visible = marker.front > 0.02
        return (
          <button
            key={marker.id}
            type="button"
            onClick={() => onSelect(marker.id)}
            aria-label={marker.name}
            className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 focus:outline-none"
            style={{
              left: `${(marker.x / 200) * 100}%`,
              top: `${(marker.y / 200) * 100}%`,
              opacity: visible ? Math.min(1, 0.25 + marker.front * 1.6) : 0,
              pointerEvents: visible ? 'auto' : 'none',
              transition: 'opacity 300ms linear',
              zIndex: isActive ? 20 : 10,
            }}
          >
            <span className="relative flex size-2.5 items-center justify-center">
              <span
                className={`absolute inline-flex size-full animate-ping rounded-full ${
                  isActive ? 'bg-brand-300' : 'bg-brand-400/70'
                }`}
              />
              <span
                className={`relative inline-flex size-2 rounded-full ring-2 ring-white/70 ${
                  isActive ? 'bg-white' : 'bg-brand-400'
                }`}
              />
            </span>
            <span
              className={`whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm transition-opacity ${
                isActive
                  ? 'border-white/30 bg-brand-500/90 text-white opacity-100'
                  : 'border-white/15 bg-[#06131c]/75 text-white opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'
              }`}
            >
              {marker.name}
            </span>
          </button>
        )
      })}

      {/* Orbiting plane */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
      >
        <span className="absolute left-1/2 top-[3%] -translate-x-1/2 rounded-full bg-white/90 p-1 shadow-lg">
          <Plane className="size-3 text-brand-600" />
        </span>
      </motion.div>
    </div>
  )
}

export function TravelGlobe({ className }) {
  const [activeId, setActiveId] = useState('globe-paris')

  const activeMarker = globeDestinations.find((m) => m.id === activeId)
  const activeCity = activeMarker ? cityBlurbs[activeMarker.name] : null

  const fallback = <EarthGlobe activeId={activeId} onSelect={setActiveId} />

  return (
    <div className={className}>
      <Card className="relative overflow-hidden p-6 sm:p-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              'radial-gradient(120% 80% at 50% 0%, rgba(56,189,248,0.18), transparent 60%)',
          }}
        />

        <div className="relative mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-muted">
            <Globe2 className="size-3.5 text-brand-500" />
            Explore destinations around the world
          </div>
          <span className="hidden rounded-full border border-line px-2 py-0.5 text-[10px] font-medium text-muted sm:inline">
            {globeDestinations.length} destinations
          </span>
        </div>

        <div className="relative">
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
        </div>

        <div className="relative mt-5 min-h-16 rounded-xl border border-line bg-surface-alt p-4">
          {activeCity || activeMarker ? (
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-display text-sm font-semibold text-fg">
                  {activeMarker.name}, {activeCity?.country || activeMarker.country}
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  {activeCity?.description || 'A GlobeTrotter favorite — tap to start planning.'}
                </p>
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
