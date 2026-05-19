import { cn } from '../../lib/cn'

interface TimelineProps {
  items: Array<{ id: string; title: string; detail: string; status: 'complete' | 'active' | 'next' }>
}

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="space-y-4">
      {items.length === 0 && (
        <div className="text-sm text-slate-500">
          No timeline events available
        </div>
      )}
      {items.map((item, index) => (
        <div key={item.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <span
              className={cn(
                'mt-1 h-3 w-3 rounded-full ring-4 ring-offset-0',
                item.status === 'complete' && 'bg-emerald-400 ring-emerald-400/25',
                item.status === 'active' && 'bg-cyan-400 ring-cyan-400/25',
                item.status === 'next' && 'bg-white/20 ring-white/10',
              )}
            />
            {index < items.length - 1 ? <span className="mt-2 h-full w-px bg-white/10" /> : null}
          </div>
          <div className="pb-5">
            <p className="text-sm font-semibold text-white">{item.title}</p>
            <p className="mt-1 text-sm text-slate-400">{item.detail}</p>
          </div>
        </div>
      ))}
    </div>
  )
}