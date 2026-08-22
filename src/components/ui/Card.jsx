import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

export const Card = forwardRef(function Card({ className, children, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn('rounded-2xl border border-line bg-card shadow-card', className)}
      {...props}
    >
      {children}
    </div>
  )
})

export default Card
