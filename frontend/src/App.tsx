import { lazy, Suspense, type ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { AppShell } from './components/layouts/AppShell'
import { Loader } from './components/ui/Loader'
import { AppProvider } from './context/AppContext'
import { AuthLayout } from './pages/auth/AuthLayout'
import { ProtectedRoute } from './pages/auth/ProtectedRoute';
import { OAuthSuccessPage } from "./pages/auth/OAuthSuccessPage";

const DashboardPage = lazy(() =>
  import('./pages/app/DashboardPage').then((module) => ({ default: module.DashboardPage })),
)
const RecordingPage = lazy(() =>
  import('./pages/app/RecordingPage').then((module) => ({ default: module.RecordingPage })),
)
const TestExecutionPage = lazy(() =>
  import('./pages/app/TestExecutionPage').then((module) => ({ default: module.TestExecutionPage })),
)
const HealingPage = lazy(() =>
  import('./pages/app/HealingPage').then((module) => ({ default: module.HealingPage })),
)
const ReportsPage = lazy(() =>
  import('./pages/app/ReportsPage').then((module) => ({ default: module.ReportsPage })),
)
const PipelinesPage = lazy(() =>
  import('./pages/app/PipelinesPage').then((module) => ({ default: module.PipelinesPage })),
)
const SettingsPage = lazy(() =>
  import('./pages/app/SettingsPage').then((module) => ({ default: module.SettingsPage })),
)
const LoginPage = lazy(() =>
  import('./pages/auth/LoginPage').then((module) => ({ default: module.LoginPage })),
)
const SignupPage = lazy(() =>
  import('./pages/auth/SignupPage').then((module) => ({ default: module.SignupPage })),
)
const ForgotPasswordPage = lazy(() =>
  import('./pages/auth/ForgotPasswordPage').then((module) => ({ default: module.ForgotPasswordPage })),
)

function RoutedPage({ children }: { children: ReactNode }) {
  return <Suspense fallback={<Loader />}>{children}</Suspense>
}

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route
            path="/oauth-success"
            element={<OAuthSuccessPage />}
          />
          <Route path="/login" element={<RoutedPage><LoginPage /></RoutedPage>} />
          <Route path="/signup" element={<RoutedPage><SignupPage /></RoutedPage>} />
          <Route path="/forgot-password" element={<RoutedPage><ForgotPasswordPage /></RoutedPage>} />
        </Route>

        <Route path="/app" element={<ProtectedRoute> <AppShell /></ProtectedRoute>}>
          <Route path="dashboard" element={<RoutedPage><DashboardPage /></RoutedPage>} />
          <Route path="recordings" element={<RoutedPage><RecordingPage /></RoutedPage>} />
          <Route path="test-runs" element={<RoutedPage><TestExecutionPage /></RoutedPage>} />
          <Route path="healing" element={<RoutedPage><HealingPage /></RoutedPage>} />
          <Route path="reports" element={<RoutedPage><ReportsPage /></RoutedPage>} />
          <Route path="pipelines" element={<RoutedPage><PipelinesPage /></RoutedPage>} />
          <Route path="settings" element={<RoutedPage><SettingsPage /></RoutedPage>} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        <Route path="/" element={<Navigate to="/signup" replace />} />
        <Route path="*" element={<Navigate to="/signup" replace />} />
      </Routes>
    </AppProvider >
  )
}

export default App