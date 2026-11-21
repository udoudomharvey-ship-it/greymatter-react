import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, RM } from '../gsap'

export function useSmoothScroll() {
  useEffect(() => {
    if (RM) return
    const lenis = new Lenis({ lerp: 0.09 })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t: number) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!a) return
      const h = a.getAttribute('href') ?? ''
      const target = h.length > 1 ? document.querySelector<HTMLElement>(h) : null
      if (target) {
        e.preventDefault()
        lenis.scrollTo(target, { duration: 1.6 })
      }
    }
    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('click', onClick)
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])
}
