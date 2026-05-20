import { ChevronDown, Bell, LogOut, Menu, Search, Settings, Sparkles, User } from 'lucide-react'
import { useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { ThemeToggle } from '../ui/ThemeToggle'
import { useNotifications } from "../../context/NotificationContext";


type NotificationType = {
  title: string;
  message: string;
};

export function Topbar() {
  const {
    projects,
    selectedProject,
    setSelectedProject,
    selectedWorkspace,
    setSelectedWorkspace,
    workspaces,
    toggleSidebar,
    setCommandOpen,
    user,
    logout,
  } = useAppContext()


  const {
    notifications: liveNotifications
  } = useNotifications();

  const [profileOpen, setProfileOpen] =
    useState(false)

  const [
    isNotificationOpen,
    setIsNotificationOpen
  ] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 px-4 py-4 backdrop-blur-xl sm:px-6">
      <div className="flex flex-wrap items-center gap-3 lg:flex-nowrap">

        <button
          type="button"
          onClick={toggleSidebar}
          title="Toggle sidebar"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition hover:text-white lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex min-w-[210px] flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <Search className="h-4 w-4 text-cyan-300" />

          <button
            type="button"
            onClick={() => setCommandOpen(true)}
            className="flex flex-1 items-center justify-between text-sm text-slate-400"
          >
            <span>
              Search QA analytics, runs, reports...
            </span>

            <span className="rounded-full border border-white/10 px-2 py-1 text-[11px] uppercase tracking-[0.2em] text-slate-500">
              ⌘K
            </span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">

          <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">

            <Sparkles className="h-4 w-4 text-cyan-300" />

            <select
              value={selectedWorkspace?.id ?? ''}
              onChange={(event) =>
                setSelectedWorkspace(
                  event.target.value
                )
              }
              aria-label="Select workspace"
              className="bg-transparent text-sm outline-none"
            >

              {workspaces.length === 0 ? (

                <option value="">
                  No workspace
                </option>

              ) : (

                workspaces.map((workspace) => (

                  <option
                    key={workspace.id}
                    value={workspace.id}
                    className="bg-slate-950"
                  >
                    {workspace.name} · {workspace.plan}
                  </option>
                ))
              )}

            </select>
          </label>

          <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">

            <select
              value={selectedProject?.id ?? ''}
              onChange={(event) =>
                setSelectedProject(
                  event.target.value
                )
              }
              aria-label="Select project"
              className="bg-transparent text-sm outline-none"
            >

              {projects.length === 0 ? (

                <option value="">
                  No projects
                </option>

              ) : (

                projects.map((project) => (

                  <option
                    key={project.id}
                    value={project.id}
                    className="bg-slate-950"
                  >
                    {project.name} · {project.environment}
                  </option>
                ))
              )}

            </select>
          </label>

          <ThemeToggle />

          <div className="relative">

            <button onClick={() =>
              setIsNotificationOpen(
                !isNotificationOpen
              )
            }
              type="button"
              title="Notifications"
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition hover:text-white"
            >

              <Bell className="h-5 w-5" />

              {liveNotifications.length > 0 && (

                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
              )}

            </button>

            {
              isNotificationOpen && (
                <div className="absolute right-0 top-14 z-50 w-80 rounded-2xl border border-white/10 bg-slate-950 p-3 shadow-2xl">
                  <h3 className="mb-3 text-sm font-semibold text-white">
                    Notifications
                  </h3>

                  <div className="max-h-96 space-y-2 overflow-y-auto">

                    {liveNotifications.length === 0 ? (

                      <p className="text-sm text-slate-500">
                        No notifications
                      </p>

                    ) : (

                      liveNotifications.map(
                        (
                          notification: NotificationType,
                          index: number
                        ) => (
                          <div
                            key={index}
                            className="rounded-xl border border-white/10 bg-white/5 p-3"
                          >

                            <h4 className="text-sm font-medium text-white">
                              {notification.title}
                            </h4>

                            <p className="mt-1 text-xs text-slate-400">
                              {notification.message}
                            </p>

                          </div>
                        ))
                    )}

                  </div>
                </div>
              )}
          </div>


          <div className="relative flex items-center">
            <div
              onClick={() =>
                setProfileOpen(
                  !profileOpen
                )
              }
              className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/10"
            >

              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/90 to-violet-500/90 font-semibold text-slate-950">

                {selectedWorkspace?.name
                  ?.slice(0, 2)
                  .toUpperCase() || 'AI'}

              </div>

              <div className="hidden text-left md:block">

                <p className="font-medium text-white">

                  {user?.name ||
                    'AI Workspace'}

                </p>

                <p className="text-xs text-slate-500">

                  {user?.email ||
                    'Guest User'} · {liveNotifications.length} alerts

                </p>

              </div>

              <ChevronDown className="h-4 w-4" />

            </div>

            {
              profileOpen && (

                <div className="absolute right-0 top-14 z-50 w-64 rounded-2xl border border-white/10 bg-slate-950 p-2 shadow-2xl backdrop-blur-xl">

                  <div className="border-b border-white/10 px-3 py-3">

                    <p className="font-medium text-white">
                      {user?.name || "Guest"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {user?.email || "No email"}
                    </p>

                  </div>

                  <button
                    type="button"
                    className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </button>



                  <button
                    type="button"
                    onClick={logout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-red-400 transition hover:bg-red-500/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>

                </div>
              )
            }

          </div>
        </div>
      </div>
    </header>
  )
}