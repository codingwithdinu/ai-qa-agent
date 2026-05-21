import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { PropsWithChildren } from 'react'

import { ActionButton } from '../../components/ui/ActionButton'

interface AuthCardProps extends PropsWithChildren {
  title: string
  description: string
  footerPrompt: string
  footerAction: string
  footerTo: string
}

export function AuthCard({ title, description, footerPrompt, footerAction, footerTo, children }: AuthCardProps) {

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel w-full max-w-xl p-6 sm:p-8"
    >
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">AI QA Agent</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
        </div>
      </div>

      <div className="space-y-4">{children}</div>

      <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <p>
          {footerPrompt}{' '}
          <Link to={footerTo} className="font-semibold text-cyan-300 hover:text-cyan-200">
            {footerAction}
          </Link>
        </p>
        <ActionButton
          variant="ghost"
          onClick={() => {
            window.open(
              "https://calendly.com",
              "_blank"
            );
          }}
          className="px-0 text-cyan-300 hover:bg-transparent hover:text-cyan-200"
        >
          Request demo
        </ActionButton>
      </div>
    </motion.div>
  )
}