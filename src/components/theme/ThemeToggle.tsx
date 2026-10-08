import { useState } from 'react'
import { Moon, Sun } from 'lucide-react'

const storageKey = 'jhomes-theme'

export function applyTheme(theme: 'light' | 'dark') {
  document.documentElement.dataset.theme = theme
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#141211' : '#F3F0EA')
  try {
    localStorage.setItem(storageKey, theme)
  } catch {
    /* storage can be blocked */
  }
}

function readTheme(): 'light' | 'dark' {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>(readTheme)
  const dark = theme === 'dark'

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-pressed={dark}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={() => {
        const next = dark ? 'light' : 'dark'
        applyTheme(next)
        setTheme(next)
      }}
    >
      {dark ? <Sun size={20} strokeWidth={1.25} aria-hidden="true" /> : <Moon size={20} strokeWidth={1.25} aria-hidden="true" />}
    </button>
  )
}
