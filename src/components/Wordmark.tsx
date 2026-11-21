import { useEffect, useRef } from 'react'
import { gsap, RM } from '../gsap'

/** Pointer devices: weight swells near the cursor. Touch devices: a slow wave of weight runs through the letters. */
export default function Wordmark() {
  const root = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    if (RM || !root.current) return
    const el = root.current, ls = Array.from(el.querySelectorAll<HTMLElement>('i'))
    const fine = matchMedia('(pointer:fine)').matches
    const ctx = gsap.context(() => {
      gsap.from(ls, { yPercent: 105, duration: 1.4, ease: 'expo.out', stagger: 0.06, delay: 0.2 })
      if (!fine) gsap.to(ls, { fontWeight: 650, duration: 1.8, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: { each: 0.18, repeat: -1, yoyo: true }, delay: 1.6 })
    })
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      ls.forEach((l) => {
        const b = l.getBoundingClientRect()
        const d = Math.hypot(e.clientX - (b.left + b.width / 2), (e.clientY - (r.top + r.height / 2)) * 0.6)
        gsap.to(l, { fontWeight: Math.round(300 + 380 * Math.exp((-d * d) / 90000)), duration: 0.5, overwrite: true })
      })
    }
    if (fine) addEventListener('pointermove', move)
    return () => { ctx.revert(); removeEventListener('pointermove', move) }
  }, [])
  return (
    <h1 id="wm" ref={root} aria-label="GreyMatter">
      {'GREYMATTER'.split('').map((c, i) => <span key={i} aria-hidden="true"><i>{c}</i></span>)}
    </h1>
  )
}
