import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

import type { MetricCardData } from '../../types/platform'
import { GlassPanel } from './GlassPanel'

const accentMap: Record<MetricCardData['tone'], string> = {
  cyan: 'from-cyan-400/30 to-blue-500/10 text-cyan-100',
  emerald: 'from-emerald-400/30 to-teal-500/10 text-emerald-100',
  rose: 'from-rose-400/30 to-fuchsia-500/10 text-rose-100',
  violet: 'from-violet-400/30 to-cyan-500/10 text-violet-100',
  amber: 'from-amber-400/30 to-orange-500/10 text-amber-100',
}

interface StatCardProps {
  item: MetricCardData
  index: number
}

export function StatCard({ item, index }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
    >
      <GlassPanel className="relative overflow-hidden p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-[0_24px_60px_rgba(34,211,238,0.16)]">
        <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accentMap[item.tone]}`} />
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-400">{item.label}</p>
            <p className="mt-4 text-3xl font-semibold tracking-tight text-white">{item.value}</p>
          </div>
          <span className="rounded-full bg-white/5 p-2 text-cyan-300">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
        <div className="mt-5 flex items-end justify-between gap-3 text-sm">
          <span className="text-cyan-300">{item.delta}</span>
          <span className="max-w-[12rem] text-right text-slate-500">{item.caption}</span>
        </div>
      </GlassPanel>
    </motion.div>
  )
}