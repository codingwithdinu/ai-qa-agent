import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren, } from 'react'
import { getAppShellData } from '../services/dashboard.service'
import type { ActivityItem, ProjectSummary, SearchCommandItem, Workspace, NavigationItem } from '../types/platform'
import api from "../api/client";


interface AuthUser {
  id: string
  name: string
  email: string
  role?: string
}


interface AppContextValue {
  workspaces: Workspace[]
  projects: ProjectSummary[]
  commands: SearchCommandItem[]
  navigationItems: NavigationItem[]
  selectedWorkspace?: Workspace
  setSelectedWorkspace: (workspaceId: string) => void
  selectedProject?: ProjectSummary
  setSelectedProject: (projectId: string) => void
  activities: ActivityItem[]
  notifications: Array<{ id: string; title: string; description: string }>
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  commandOpen: boolean
  setCommandOpen: (open: boolean) => void
  assistantOpen: boolean
  setAssistantOpen: (open: boolean) => void
  user: AuthUser | null
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>
  logout: () => void
  authLoading: boolean
}

const AppContext = createContext<AppContextValue | undefined>(undefined)



export function AppProvider({ children }: PropsWithChildren) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [projects, setProjects] = useState<ProjectSummary[]>([])
  const [commands, setCommands] = useState<SearchCommandItem[]>([])
  const [notifications, setNotifications] = useState<Array<{ id: string; title: string; description: string }>>([])
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(localStorage.getItem("selectedWorkspaceId") || '')
  const [selectedProjectId, setSelectedProjectId] = useState('')
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)
  const [assistantOpen, setAssistantOpen] = useState(true)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([])



  useEffect(() => {
    async function loadAppData() {
      try {
        const data =
          await getAppShellData();
        let userWorkspaces: Workspace[] = [];
        const savedUser =
          localStorage.getItem(
            "user"
          );

        if (savedUser) {

          const parsedUser =
            JSON.parse(savedUser);

          userWorkspaces =
            parsedUser.workspaces?.map(
              (item: any) => item.workspace
            ) || [];

          setWorkspaces(
            userWorkspaces
          );


        }
        setProjects(
          data.projects
        );
        setNotifications(
          data.notifications || []
        );
        setCommands(
          data.searchCommands || []
        );
        setNavigationItems(
          data.navigationItems || []
        );
        const savedWorkspace =
          localStorage.getItem(
            "selectedWorkspaceId"
          );

        setSelectedWorkspaceId(savedWorkspace || userWorkspaces?.[0]?.id || '');
        setSelectedProjectId(
          data.projects?.[0]?.id || ''
        );
      } catch (error) {
        console.error(error);
      }
    }
    loadAppData();
  }, []);


  useEffect(() => {

    async function loadUser() {

      try {

        const token =
          localStorage.getItem(
            "token"
          )

        if (!token) {

          setAuthLoading(false)

          return

        }

        const response =
          await api.get(
            "/auth/me"
          )

        setUser(
          response.data.user
        )

      } catch (error) {

        console.error(error)

        localStorage.removeItem(
          "token"
        )

        localStorage.removeItem(
          "user"
        )

      } finally {

        setAuthLoading(false)

      }

    }

    loadUser()

  }, [])

  useEffect(() => {
    const eventSource =
      new EventSource(
        `${import.meta.env.VITE_API_URL}/logs`
      );
    eventSource.onerror = () => {
      console.error(
        "SSE connection failed"
      );
      eventSource.close();
    };
    eventSource.onmessage = (event) => {
      const log =
        JSON.parse(event.data);
      const activity: ActivityItem = {
        id: Date.now().toString(),
        title: log.level?.toUpperCase() || "LOG",
        detail: log.message,
        type: "pipeline",
        status:
          log.level === "error"
            ? "warning"
            : log.level === "success"
              ? "success"
              : "info",

        actor:
          log.actor ||
          "System",

        time:
          new Date()
            .toLocaleTimeString(),
      };

      setActivities((current) =>
        [activity, ...current].slice(0, 10)
      );
    };

    return () => {
      eventSource.close();
    };

  }, []);



  const setSelectedWorkspace = useCallback(
    (workspaceId: string) => {
      localStorage.setItem(
        "selectedWorkspaceId",
        workspaceId
      )

      setSelectedWorkspaceId(
        workspaceId
      )
    },
    []
  )

  const setSelectedProject = useCallback((projectId: string) => {
    setSelectedProjectId(projectId)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("token")
    setUser(null)
    window.location.href = "/login"
  }, [])

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((value) => !value)
  }, [])

  const selectedWorkspace = useMemo(
    () => workspaces.find((workspace) => workspace.id === selectedWorkspaceId),
    [selectedWorkspaceId, workspaces],
  )

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId),
    [projects, selectedProjectId],
  )

  const value = useMemo(
    () => ({
      workspaces,
      projects,
      commands,
      navigationItems,
      selectedWorkspace,
      setSelectedWorkspace,
      selectedProject,
      setSelectedProject,
      activities,
      notifications,
      sidebarCollapsed,
      toggleSidebar,
      commandOpen,
      setCommandOpen,
      assistantOpen,
      setAssistantOpen,
      user,
      setUser,
      logout,
      authLoading,
    }),
    [
      activities,
      assistantOpen,
      navigationItems,
      commandOpen,
      commands,
      notifications,
      projects,
      selectedProject,
      selectedWorkspace,
      setSelectedProject,
      setSelectedWorkspace,
      sidebarCollapsed,
      toggleSidebar,
      workspaces,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }

  return context
}