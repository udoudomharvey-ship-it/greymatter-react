import { useEffect } from 'react'
import { gsap } from '../gsap'
import { layout, update } from '../walls'

export function useWalls() {
  useEffect(() => {
    const run = () => layout()
    run()
    const ro = new ResizeObserver(run)
    document.querySelectorAll('main > section').forEach((el) => ro.observe(el))
    window.addEventListener('resize', run)
    document.fonts.ready.then(run)
    const t1 = window.setTimeout(run, 600)
    const t2 = window.setTimeout(run, 2000)
    const tick = () => update(window.scrollY)
    gsap.ticker.add(tick)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', run)
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      gsap.ticker.remove(tick)
    }
  }, [])
}
