import { motion } from 'motion/react'
import { Moon, Sun } from 'lucide-react'
import useTheme from '../../hooks/useTheme'
import { cn } from '../../utils/cn'

export function ThemeToggle({ className }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'flex size-9 items-center justify-center rounded-full border border-line bg-card text-muted transition-colors hover:text-fg',
        className,
      )}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
    >
      <motion.span
        key={theme}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
      </motion.span>
    </motion.button>
  )
}

export default ThemeToggle
