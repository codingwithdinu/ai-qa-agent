import { Outlet } from 'react-router-dom'

import { useAppContext } from '../../context/AppContext'
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { SearchDialog } from '../ui/SearchDialog'
import { ToastViewport } from '../ui/ToastViewport'

export function AppShell() {
  const { setCommandOpen } = useAppContext()

  useKeyboardShortcuts({
    openSearch: () => setCommandOpen(true),
  })

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <Topbar />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
      <SearchDialog />
      <ToastViewport />
    </div>
  )
}