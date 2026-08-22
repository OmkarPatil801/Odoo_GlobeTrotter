import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { cn } from '../../utils/cn'

const MotionLink = motion.create(Link)
const MotionButton = motion.create('button')

export function IconButton({ icon: Icon, to, label, className, ...props }) {
  const classes = cn(
    'flex size-9 items-center justify-center rounded-full border border-line bg-card text-muted transition-colors hover:text-fg',
    className,
  )

  const motionProps = {
    whileHover: { scale: 1.06 },
    whileTap: { scale: 0.94 },
    transition: { duration: 0.15, ease: 'easeOut' },
  }

  if (to) {
    return (
      <MotionLink to={to} aria-label={label} className={classes} {...motionProps} {...props}>
        <Icon className="size-4" strokeWidth={2} />
      </MotionLink>
    )
  }

  return (
    <MotionButton type="button" aria-label={label} className={classes} {...motionProps} {...props}>
      <Icon className="size-4" strokeWidth={2} />
    </MotionButton>
  )
}

export default IconButton
