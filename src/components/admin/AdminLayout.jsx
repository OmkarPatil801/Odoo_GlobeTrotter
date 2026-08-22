import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Bell, LogOut, Menu, Search, X } from 'lucide-react'
import AdminSidebar from './AdminSidebar'
import ThemeToggle from '../ui/ThemeToggle'
import Input from '../ui/Input'
import IconButton from '../ui/IconButton'
import useAuth from '../../hooks/useAuth'

function initialsOf(name = '') {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar className="hidden lg:flex" />

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-[#08161f]/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="relative"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <AdminSidebar className="h-full" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-surface/85 px-4 backdrop-blur-md sm:px-6">
          <IconButton
            icon={mobileOpen ? X : Menu}
            label="Toggle admin menu"
            className="lg:hidden"
            onClick={() => setMobileOpen((p) => !p)}
          />

          <Input
            icon={Search}
            placeholder="Search users, trips, destinations…"
            aria-label="Admin search"
            containerClassName="max-w-md flex-1"
            className="py-2.5"
          />

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <IconButton icon={Bell} label="Notifications" />
            <span className="flex size-9 items-center justify-center rounded-full bg-brand-500/15 text-xs font-semibold text-brand-600 dark:text-brand-400">
              {initialsOf(user?.name) || 'AD'}
            </span>
            <IconButton icon={LogOut} label="Log out" onClick={handleLogout} />
          </div>
        </header>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
