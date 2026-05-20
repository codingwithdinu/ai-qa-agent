import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { ToastProvider } from './context/ToastContext'
import { ThemeProvider } from './hooks/useTheme'
import './index.css'
import { NotificationProvider } from "./context/NotificationContext";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>,
)