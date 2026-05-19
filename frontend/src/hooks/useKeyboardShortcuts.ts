import { useEffect } from 'react'

interface ShortcutHandlers {
  openSearch: () => void
  toggleAssistant: () => void
  toggleTheme: () => void
}

export function useKeyboardShortcuts({ openSearch, toggleAssistant, toggleTheme }: ShortcutHandlers) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        openSearch()
      }

      if (event.key === '/' && !event.metaKey && !event.ctrlKey) {
        const target = event.target as HTMLElement | null
        const isTyping =
          target &&
          (
            ['INPUT', 'TEXTAREA']
              .includes(target.tagName)
            ||
            target.isContentEditable
          )
        if (!isTyping) {
          event.preventDefault()
          openSearch()
        }
      }

      if (event.shiftKey && event.key.toLowerCase() === 'a') {
        event.preventDefault()
        toggleAssistant()
      }

      if (event.shiftKey && event.key.toLowerCase() === 't') {
        event.preventDefault()
        toggleTheme()
      }
      if (event.key === 'Escape') {
        toggleAssistant();
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [openSearch, toggleAssistant, toggleTheme])
}