import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { cn } from '../../utils/cn'

export function Modal({ open, onClose, title, className, children }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="absolute inset-0 bg-[#0b1a26]/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className={cn(
              'relative w-full max-w-md rounded-2xl border border-line bg-card p-6 shadow-lift',
              className,
            )}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-4 flex items-center justify-between">
              {title && <h3 className="font-display text-lg font-semibold text-fg">{title}</h3>}
              <button
                type="button"
                onClick={onClose}
                className="ml-auto rounded-full p-1.5 text-muted transition-colors hover:bg-surface-alt hover:text-fg"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Modal
