import { Outlet } from 'react-router-dom'

import { useAppContext } from '../../context/AppContext'
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts'
import { useTheme } from '../../hooks/useTheme'
import { AssistantPanel } from './AssistantPanel'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { SearchDialog } from '../ui/SearchDialog'
import { ToastViewport } from '../ui/ToastViewport'

export function AppShell() {
  const { setCommandOpen, assistantOpen, setAssistantOpen } = useAppContext()
  const { toggleTheme } = useTheme()

  useKeyboardShortcuts({
    openSearch: () => setCommandOpen(true),
    toggleAssistant: () => setAssistantOpen(!assistantOpen),
    toggleTheme,
  })

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.16),_transparent_30%),var(--surface-0)] text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <Topbar />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
        <AssistantPanel />
      </div>
      <SearchDialog />
      <ToastViewport />
    </div>
  )
}