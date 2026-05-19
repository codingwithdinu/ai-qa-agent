import type { PropsWithChildren } from 'react'

import { cn } from '../../lib/cn'

interface GlassPanelProps extends PropsWithChildren {
  className?: string
}

export function GlassPanel({ children, className }: GlassPanelProps) {
  return <div
    className={cn('glass-panel', className)}
    role="presentation"
  >{children}</div>
}