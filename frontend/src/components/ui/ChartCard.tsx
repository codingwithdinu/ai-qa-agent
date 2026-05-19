import type { PropsWithChildren, ReactNode } from 'react'
import { GlassPanel } from './GlassPanel'

interface ChartCardProps extends PropsWithChildren {
  title: string
  description: string
  actions?: ReactNode
}

export function ChartCard({ title, description, actions, children }: ChartCardProps) {
  return (
    <GlassPanel className="h-full p-5">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="mt-1 text-sm text-slate-400">{description}</p>
        </div>
        {actions}
      </div>
      <div className="h-[260px]">{children}</div>
    </GlassPanel>
  )
}