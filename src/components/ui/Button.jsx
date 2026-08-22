import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { cn } from '../../utils/cn'

const MotionLink = motion.create(Link)
const MotionButton = motion.create('button')

const variantClasses = {
  primary: 'bg-brand-500 text-white shadow-glow hover:bg-brand-400',
  secondary: 'border border-line bg-card text-fg hover:bg-surface-alt',
  outline: 'border border-white/60 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20',
  ghost: 'text-muted hover:text-fg hover:bg-surface-alt',
}

const sizeClasses = {
  sm: 'px-3.5 py-2 text-sm gap-1.5',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-6 py-3.5 text-base gap-2.5',
}

export function Button({
  to,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  className,
  children,
  ...props
}) {
  const classes = cn(
    'inline-flex items-center justify-center rounded-full font-medium tracking-tight transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none',
    variantClasses[variant],
    sizeClasses[size],
    className,
  )

  const content = (
    <>
      {Icon && iconPosition === 'left' && <Icon className="size-4" strokeWidth={2} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="size-4" strokeWidth={2} />}
    </>
  )

  const motionProps = {
    whileHover: { scale: 1.03 },
    whileTap: { scale: 0.97 },
    transition: { duration: 0.15, ease: 'easeOut' },
  }

  if (to) {
    return (
      <MotionLink to={to} className={classes} {...motionProps} {...props}>
        {content}
      </MotionLink>
    )
  }

  return (
    <MotionButton className={classes} {...motionProps} {...props}>
      {content}
    </MotionButton>
  )
}

export default Button
