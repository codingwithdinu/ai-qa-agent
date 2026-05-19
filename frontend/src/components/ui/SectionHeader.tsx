import type { ReactNode }
from 'react'

import { motion }
from 'framer-motion'

import { AIBadge } from './AIBadge'

interface SectionHeaderProps {
  eyebrow?: string
  title: string
  description: string
  action?: ReactNode
}

export function SectionHeader({ eyebrow, title, description, action }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
    >
      <div className="space-y-3">
        {eyebrow ? <AIBadge label={eyebrow} /> : null}
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">{description}</p>
        </div>
      </div>
      {action ? <div className="flex items-center gap-3">{action}</div> : null}
    </motion.div>
  )
}