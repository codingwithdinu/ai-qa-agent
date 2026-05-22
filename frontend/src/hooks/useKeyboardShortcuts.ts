import { useEffect } from 'react'

interface ShortcutHandlers {
  openSearch: () => void
}

export function useKeyboardShortcuts({ openSearch }: ShortcutHandlers) {
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
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [openSearch])
}