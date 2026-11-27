import { useEffect, useState, type MouseEvent } from 'react'
import { RM, SYS_RM } from '../gsap'
import { toggleTheme } from '../theme'

const GC = import.meta.env.VITE_GC_CODE as string | undefined

export default function Footer() {
  const [theme, setTheme] = useState(document.documentElement.dataset.theme || 'dark')
  useEffect(() => {
    const h = () => setTheme(document.documentElement.dataset.theme || 'dark')
    addEventListener('gm-theme', h)
    return () => removeEventListener('gm-theme', h)
  }, [])

  // a brief fade before leaving for the privacy and press pages
  const go = (e: MouseEvent<HTMLAnchorElement>) => {
    if (RM) return
    e.preventDefault()
    const u = e.currentTarget.href
    document.body.classList.add('leaving')
    setTimeout(() => { location.href = u }, 320)
  }
  const flipMotion = () => {
    try { localStorage.setItem('gm-motion', RM ? 'on' : 'off') } catch { /* ignore */ }
    location.reload()
  }

  return (
    <footer className="m">
      <div id="wipe" aria-hidden="true" />
      <div className="fr">
        <span>© 2026 GreyMatter Inc. · No cookies. {GC ? 'Privacy-friendly visit counts.' : 'No analytics.'} Fonts served from this site.</span>
        <a href="#hero">Back to top ↑</a>
      </div>
      <div className="fr">
        <span>
          <a href="privacy.html" onClick={go}>Privacy</a> · <a href="press.html" onClick={go}>Press kit</a>
        </span>
        <span>
          <button onClick={toggleTheme}>Theme: {theme}</button>{' '}
          <button onClick={flipMotion} disabled={SYS_RM} title={SYS_RM ? 'Your system asks for reduced motion' : undefined}>
            Motion: {RM ? 'off' : 'on'}
          </button>{' '}
          <button onClick={() => window.print()}>Print / PDF</button>
        </span>
      </div>
      <div className="fr"><span>Keys: C contact · H top · T theme</span></div>
    </footer>
  )
}
