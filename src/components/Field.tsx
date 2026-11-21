import { useEffect, useRef } from 'react'
import { RM } from '../gsap'
import { mood } from '../mood'

/** Contour field. Its colour and looseness follow the section: mint and steady for what is
 *  claimed, amber and unsettled for what is unproven, quiet at the close. */
export default function Field() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const cv = ref.current!, cx = cv.getContext('2d')!
    let W = 0, H = 0, N = 0, px = -999, py = -999, T = 0, raf = 0
    const size = () => {
      const d = Math.min(devicePixelRatio || 1, 1.5)
      W = innerWidth; H = innerHeight; cv.width = W * d; cv.height = H * d
      cx.setTransform(d, 0, 0, d, 0, 0); N = W > 800 ? 34 : 20
    }
    const move = (e: PointerEvent) => { px = e.clientX; py = e.clientY }
    const draw = () => {
      raf = requestAnimationFrame(draw)
      if (document.hidden) return
      const k = RM ? 1 : 0.04
      mood.a += (mood.ta - mood.a) * k; mood.j += (mood.tj - mood.j) * k; mood.k += (mood.tk - mood.k) * k
      if (!RM) T += 0.004
      const sy = scrollY, st = W > 800 ? 16 : 22
      const ac = `rgba(${Math.round(111 + 144 * mood.k)},${Math.round(255 - 75 * mood.k)},${Math.round(176 - 92 * mood.k)},.22)`
      cx.clearRect(0, 0, W, H)
      for (let i = 0; i < N; i++) {
        const by = ((i + 0.5) / N) * H * 1.15 - H * 0.05 + ((sy * 0.05) % (H / N))
        cx.beginPath()
        for (let x = 0; x <= W + st; x += st) {
          let y = by + Math.sin(x * 0.0042 + i * 0.33 + T + sy * 0.0004) * 14 * mood.a + Math.sin(x * 0.011 - i * 0.21 - T * 1.4) * 6 * mood.a
          y += Math.sin(x * 0.09 + T * 14 + i * 3) * mood.j * 4
          const dx = x - px, dy = y - py, g = Math.exp(-(dx * dx + dy * dy) / 26000)
          y -= g * (RM ? 0 : 34) * (dy > 0 ? 1 : -1) * 0.5
          x === 0 ? cx.moveTo(x, y) : cx.lineTo(x, y)
        }
        cx.strokeStyle = i % 9 === 4 ? ac : 'rgba(138,148,144,.12)'
        cx.stroke()
      }
    }
    size(); addEventListener('resize', size); addEventListener('pointermove', move); draw()
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', size); removeEventListener('pointermove', move) }
  }, [])
  return <canvas id="f" ref={ref} aria-hidden="true" />
}
