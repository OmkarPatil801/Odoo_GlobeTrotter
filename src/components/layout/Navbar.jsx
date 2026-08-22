import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Compass, Menu, X, Plus, User } from 'lucide-react'
import { cn } from '../../utils/cn'
import Button from '../ui/Button'
import IconButton from '../ui/IconButton'
import ThemeToggle from '../ui/ThemeToggle'
import useAuth from '../../hooks/useAuth'

const navLinks = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'My Trips', to: '/trips' },
  { label: 'Explore', to: '/search/cities' },
  { label: 'Community', to: '/community' },
  { label: 'Calendar', to: '/trips/trip-1/calendar' },
]

function NavItem({ to, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'text-sm font-medium transition-colors',
          isActive ? 'text-fg' : 'text-muted hover:text-fg',
        )
      }
    >
      {label}
    </NavLink>
  )
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isAuthenticated } = useAuth()

  return (
    <motion.header
      className="sticky top-0 z-40 border-b border-line bg-surface/85 backdrop-blur-md"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex shrink-0 items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-brand-500 text-white">
            <Compass className="size-4.5" strokeWidth={2.5} />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-fg">
            GlobeTrotter
          </span>
        </NavLink>

        {isAuthenticated && (
          <nav className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => (
              <NavItem key={link.to} {...link} />
            ))}
          </nav>
        )}

        <div className="hidden items-center gap-2.5 lg:flex">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <Button to="/trips/create" size="sm" icon={Plus}>
                Plan a Trip
              </Button>
              <IconButton to="/profile" icon={User} label="Profile" />
            </>
          ) : (
            <>
              <Button to="/login" variant="secondary" size="sm">
                Log in
              </Button>
              <Button to="/register" size="sm">
                Sign up
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <IconButton
            icon={mobileOpen ? X : Menu}
            label="Toggle menu"
            onClick={() => setMobileOpen((prev) => !prev)}
          />
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="overflow-hidden border-t border-line lg:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex flex-col gap-4 px-4 py-5 sm:px-6">
              {isAuthenticated ? (
                <>
                  {navLinks.map((link) => (
                    <NavItem key={link.to} {...link} onClick={() => setMobileOpen(false)} />
                  ))}
                  <NavItem to="/profile" label="Profile" onClick={() => setMobileOpen(false)} />
                  <Button to="/trips/create" size="sm" icon={Plus} className="mt-1 w-full">
                    Plan a Trip
                  </Button>
                </>
              ) : (
                <>
                  <Button to="/login" variant="secondary" size="sm" className="w-full" onClick={() => setMobileOpen(false)}>
                    Log in
                  </Button>
                  <Button to="/register" size="sm" className="w-full" onClick={() => setMobileOpen(false)}>
                    Sign up
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default Navbar
