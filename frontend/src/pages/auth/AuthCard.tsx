import { motion } from 'framer-motion'
import { Github, Chrome } from 'lucide-react'
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

  const API_URL =
    import.meta.env.VITE_API_URL
      .replace("/api", "");

  const handleGithubLogin = () => {
    window.location.href =
      `${API_URL}/api/auth/github`;
  };

  const handleGoogleLogin = () => {
    window.location.href =
      `${API_URL}/api/auth/google`;
  };

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

      <div className="grid gap-3 sm:grid-cols-2">
        <button type="button" onClick={handleGithubLogin} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:bg-white/10">
          <Github className="h-4 w-4" />
          Continue with GitHub
        </button>
        <button type="button" onClick={handleGoogleLogin} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:bg-white/10">
          <Chrome className="h-4 w-4" />
          Continue with Google
        </button>
      </div>

      <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-600">
        <span className="h-px flex-1 bg-white/10" />
        Or with email
        <span className="h-px flex-1 bg-white/10" />
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