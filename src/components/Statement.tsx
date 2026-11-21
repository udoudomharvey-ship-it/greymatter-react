import { Fragment, useEffect, useRef } from 'react'
import { gsap, RM } from '../gsap'

/** Words come into focus as you scroll. Starting opacity stays high enough to remain legible (WCAG large-text contrast). */
export default function Statement({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (RM || !ref.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.x', { opacity: 0.42 }, {
        opacity: 1, stagger: 0.12, ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top 80%', end: 'bottom 45%', scrub: true },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <p className="stmt" ref={ref}>
      {text.split(' ').map((w, i) => (
        <Fragment key={i}><span className="x">{w}</span>{' '}</Fragment>
      ))}
    </p>
  )
}
