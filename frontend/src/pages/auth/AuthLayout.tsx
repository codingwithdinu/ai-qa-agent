import { motion } from 'framer-motion'
import { Bot } from 'lucide-react'
import { Outlet, useLocation } from 'react-router-dom'
import { authContent } from "../../data/auth-content";
import { authFeatures } from "../../data/auth-features";


export function AuthLayout() {
  const location = useLocation()
  const content =
    location.pathname === "/signup"
      ? authContent.signup
      : location.pathname ===
        "/forgot-password"
        ? authContent.forgotPassword
        : authContent.login;
  return (
    <div className="relative flex min-h-screen overflow-hidden bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.16),_transparent_30%)]" />
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:96px_96px]" />

      <div className="relative mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} className="hidden flex-col justify-between rounded-[2rem] border border-white/10 bg-white/5 p-10 backdrop-blur-xl lg:flex">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
              <Bot className="h-4 w-4" />
              AI QA Agent
            </div>
            <h1 className="mt-8 max-w-xl text-5xl font-semibold leading-tight">{content.title}</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">{content.subtitle}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {authFeatures.map(({ icon: Icon, title, detail }) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
                <Icon className="h-5 w-5 text-cyan-300" />
                <p className="mt-4 text-sm font-semibold text-white">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{detail}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="flex items-center justify-center">
          <Outlet />
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-xs uppercase tracking-[0.34em] text-slate-600 lg:hidden">
        AI QA Agent · Autonomous quality operations
      </div>
    </div>
  )
}