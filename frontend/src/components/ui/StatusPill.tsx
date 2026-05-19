import { cn } from '../../lib/cn'

interface StatusPillProps {
  label: string
  tone?: 'success' | 'warning' | 'danger' | 'info' | 'neutral'
}

const toneMap: Record<NonNullable<StatusPillProps['tone']>, string> = {
  success: 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/30',
  warning: 'bg-amber-500/15 text-amber-300 ring-amber-400/30',
  danger: 'bg-rose-500/15 text-rose-300 ring-rose-400/30',
  info: 'bg-cyan-500/15 text-cyan-300 ring-cyan-400/30',
  neutral: 'bg-white/10 text-slate-300 ring-white/10',
}

export function StatusPill({ label, tone = 'neutral' }: StatusPillProps) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset', toneMap[tone])}>
      {label}
    </span>
  )
}