import { AnimatePresence, motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAppContext } from '../../context/AppContext'

export function SearchDialog() {
  const navigate = useNavigate()
  const { commandOpen, setCommandOpen, commands } = useAppContext()
  const [query, setQuery] = useState('')

  const filteredCommands = useMemo(() => {
    return commands.filter((command) => {
      const haystack = `${command.title} ${command.subtitle}`.toLowerCase()
      return haystack.includes(query.toLowerCase())
    })
  }, [commands, query])

  const onSelect = (to: string) => {
    navigate(to)
    setCommandOpen(false)
    setQuery('')
  }

  return (
    <AnimatePresence>
      {commandOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 pt-[12vh] backdrop-blur-md"
          onClick={() => setCommandOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            onClick={(event) => event.stopPropagation()}
            className="glass-panel w-full max-w-2xl overflow-hidden p-0"
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
              <Search className="h-5 w-5 text-cyan-300" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search pages, actions, and workflows"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                autoFocus
              />
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-500">⌘K</span>
            </div>
            <div className="max-h-[360px] overflow-auto p-3">
              {filteredCommands.length === 0 && (
                <div className="px-4 py-10 text-center text-sm text-slate-500">
                  No matching commands found
                </div>
              )}
              {filteredCommands.map((command) => (
                <button
                  key={command.id}
                  type="button"
                  onClick={() => onSelect(command.to)}
                  className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition hover:bg-white/5"
                >
                  <span>
                    <span className="block text-sm font-semibold text-white">{command.title}</span>
                    <span className="mt-1 block text-sm text-slate-400">{command.subtitle}</span>
                  </span>
                  {command.shortcut && (
                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-500">
                      {command.shortcut}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}