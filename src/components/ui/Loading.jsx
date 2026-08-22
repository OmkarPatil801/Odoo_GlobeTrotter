import { Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'

export function Loading({ label = 'Loading…', className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-16 text-muted', className)}>
      <Loader2 className="size-6 animate-spin text-brand-500" />
      <p className="text-sm">{label}</p>
    </div>
  )
}

export default Loading
