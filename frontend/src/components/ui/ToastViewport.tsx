import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react'

import { useToast } from '../../context/ToastContext'

const iconMap: Record<string, any> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
}

export function ToastViewport() {
  const { toasts, dismissToast } = useToast()

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[60] flex w-full max-w-sm flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = iconMap[toast.tone]

          return (
            <motion.button
              key={toast.id}
              type="button"
              initial={{ opacity: 0, x: 40, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 30, scale: 0.98 }}
              onClick={() => dismissToast(toast.id)}
              className="pointer-events-auto glass-panel flex items-start gap-3 p-4 text-left"
            >
              <span className="mt-0.5 rounded-2xl bg-cyan-400/10 p-2 text-cyan-200">
                <Icon className="h-4 w-4" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-white">{toast.title}</span>
                <span className="mt-1 block text-sm text-slate-400">{toast.description}</span>
              </span>
            </motion.button>
          )
        })}
      </AnimatePresence>
    </div>
  )
}