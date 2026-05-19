import { Sparkles } from 'lucide-react'

interface AIBadgeProps {
  label?: string
}
export function AIBadge({
  label = 'AI powered',
}: AIBadgeProps) {

  return (

    <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">

      <Sparkles className="h-3.5 w-3.5" />

      {label}

    </span>
  )
}