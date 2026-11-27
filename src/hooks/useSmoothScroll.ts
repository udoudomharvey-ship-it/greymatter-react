import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, RM } from '../gsap'
import { tl } from '../walls'

export function useSmoothScroll() {
  useEffect(() => {
    let lenis: Lenis | null = null
    let tick: ((t: number) => void) | null = null
    if (!RM) {
      const l = new Lenis({ lerp: 0.085 })
      lenis = l
      tick = (t: number) => l.raf(t * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
    }
    // sections are pinned to their walls, so a link must jump to the scroll position of that wall
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!a) return
      const id = (a.getAttribute('href') ?? '').slice(1)
      const secs = Array.from(document.querySelectorAll<HTMLElement>('main > section'))
      const i = secs.findIndex((s) => s.id === id)
      if (i < 0) return
      e.preventDefault()
      const y = i === 0 ? 0 : tl.start[i] + tl.base[i] * 0.35
      if (lenis) lenis.scrollTo(y, { duration: 2 })
      else window.scrollTo({ top: y })
    }
    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('click', onClick)
      if (tick) gsap.ticker.remove(tick)
      lenis?.destroy()
    }
  }, [])
}
