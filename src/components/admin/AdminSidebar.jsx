import { NavLink, Link } from 'react-router-dom'
import {
  Activity,
  ArrowLeft,
  BarChart3,
  LayoutDashboard,
  MapPin,
  Route,
  Settings,
  Users,
} from 'lucide-react'
import { cn } from '../../utils/cn'

const adminNavLinks = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Users', to: '/admin/users', icon: Users },
  { label: 'Trips', to: '/admin/trips', icon: Route },
  { label: 'Destinations', to: '/admin/destinations', icon: MapPin },
  { label: 'Activities', to: '/admin/activities', icon: Activity },
  { label: 'Analytics', to: '/admin/analytics', icon: BarChart3 },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
]

export function AdminSidebar({ className }) {
  return (
    <aside
      className={cn(
        'flex w-60 shrink-0 flex-col border-r border-line bg-card',
        className,
      )}
    >
      <div className="flex h-16 items-center gap-2 border-b border-line px-5">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white">
          GT
        </span>
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-semibold text-fg">GlobeTrotter</p>
          <p className="truncate text-[10px] uppercase tracking-[0.14em] text-brand-600 dark:text-brand-400">
            Admin
          </p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {adminNavLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand-500 text-white'
                  : 'text-muted hover:bg-surface-alt hover:text-fg',
              )
            }
          >
            <link.icon className="size-4 shrink-0" />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-line p-3">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface-alt hover:text-fg"
        >
          <ArrowLeft className="size-4 shrink-0" />
          Back to site
        </Link>
      </div>
    </aside>
  )
}

export default AdminSidebar
