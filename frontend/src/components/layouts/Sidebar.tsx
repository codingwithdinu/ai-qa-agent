import { AnimatePresence, motion } from 'framer-motion'
import {
  Activity,
  Bot,
  ChartColumnBig,
  Gauge,
  Layers3,
  LayoutDashboard,
  Link2,
  PlayCircle,
  Settings,
  WandSparkles,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { cn } from '../../lib/cn'
import { useAppContext } from '../../context/AppContext'

const iconMap: Record<string, any> = {
  dashboard: LayoutDashboard,
  recordings: PlayCircle,
  'test-runs': Activity,
  healing: WandSparkles,
  reports: ChartColumnBig,
  pipelines: Gauge,
  integrations: Link2,
  settings: Settings,
}

export function Sidebar() {
  const {
    sidebarCollapsed,
    navigationItems,
  } = useAppContext()


  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 94 : 280 }}
      transition={{ type: 'spring', stiffness: 220, damping: 24 }}
      className="hidden border-r border-white/10 bg-slate-950/70 px-4 py-6 backdrop-blur-xl lg:flex lg:flex-col"
    >
      <div className="flex items-center gap-3 px-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 text-slate-950 shadow-[0_0_40px_rgba(34,211,238,0.45)]">
          <Bot className="h-6 w-6" />
        </div>
        <AnimatePresence initial={false}>
          {!sidebarCollapsed ? (
            <motion.div initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -4 }}>
              <p className="text-sm uppercase tracking-[0.32em] text-cyan-300">AI QA Agent</p>
              <p className="text-sm text-slate-400">Autonomous quality operations</p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="mt-10 flex-1 space-y-2">
        {navigationItems.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-400">
            Navigation unavailable
          </div>
        )}
        {navigationItems.map((item) => {
          const Icon =
            iconMap[item.id] ||
            LayoutDashboard
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition',
                  isActive ? 'bg-cyan-400/10 text-white shadow-[inset_0_0_0_1px_rgba(34,211,238,0.18)]' : 'text-slate-400 hover:bg-white/5 hover:text-white',
                )
              }
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-cyan-300 transition group-hover:bg-cyan-400/10">
                <Icon className="h-5 w-5" />
              </span>
              <AnimatePresence initial={false}>
                {!sidebarCollapsed ? (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-hidden">
                    <span className="block truncate">{item.label}</span>
                    <span className="mt-0.5 block truncate text-xs text-slate-500">{item.description}</span>
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </NavLink>
          )
        })}
      </div>

      <div className="glass-panel mt-6 hidden overflow-hidden p-4 lg:block">
        <div className="flex items-center gap-3">
          <span className="rounded-2xl bg-violet-400/15 p-2 text-violet-200">
            <Layers3 className="h-4 w-4" />
          </span>
          {!sidebarCollapsed ? (
            <div>
              <p className="text-sm font-semibold text-white">Multi-workspace</p>
              <p className="text-xs text-slate-400">Enterprise project isolation</p>
            </div>
          ) : null}
        </div>
      </div>
    </motion.aside>
  )
}