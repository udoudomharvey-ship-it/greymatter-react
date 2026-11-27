import { useEffect } from 'react'
import { toggleTheme } from '../theme'

/** C = contact, H = top, T = theme. Ignored while typing and with modifier keys. */
export function useShortcuts() {
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const t = e.target as HTMLElement
      if (/INPUT|TEXTAREA|SELECT/.test(t.tagName) || t.isContentEditable) return
      const click = (s: string) => document.querySelector<HTMLElement>(s)?.click()
      const k = e.key.toLowerCase()
      if (k === 'c') click('nav a[href="#contact"]')
      else if (k === 'h') click('footer a[href="#hero"]')
      else if (k === 't') toggleTheme()
    }
    addEventListener('keydown', h)
    return () => removeEventListener('keydown', h)
  }, [])
}
