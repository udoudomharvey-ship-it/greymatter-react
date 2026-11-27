import { gsap, RM } from './gsap'
import { setMood, type Mood } from './mood'

/** Scroll timeline: for each section, the scroll range during which the camera stands facing its wall. */
export const tl = { start: [] as number[], end: [] as number[], base: [] as number[] }
/** Current opacity (0 to 1) of each section's card, used to cross-fade the framed piece on the wall. */
export const op: number[] = []

const PAD = 76 // space kept clear at the top and bottom of the screen
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x))
const travel = () => Math.max(520, 0.9 * window.innerHeight) // scroll distance between two walls

let els: HTMLElement[] = []
let heights: number[] = []
let active = -1

function reveal(el: HTMLElement) {
  if (RM) return
  gsap.fromTo(Array.from(el.children), { opacity: 0, y: 22 },
    { opacity: 1, y: 0, duration: 0.8, stagger: 0.07, ease: 'power3.out', overwrite: 'auto', clearProps: 'opacity,transform' })
}

export function layout() {
  els = Array.from(document.querySelectorAll<HTMLElement>('main > section'))
  const vh = window.innerHeight
  let pos = 0
  tl.start = []; tl.end = []; tl.base = []; heights = []
  els.forEach((el, i) => {
    const h = i === 0 ? 0 : el.offsetHeight
    heights.push(h)
    const over = Math.max(0, h - (vh - 2 * PAD))        // how much of the card is taller than the screen
    const base = (i === 0 ? 0.5 : 0.6) * vh              // time spent facing the wall
    tl.start.push(pos)
    tl.base.push(base)
    tl.end.push(pos + base + over)
    pos += base + over + travel()
  })
  const last = tl.end.length - 1
  const main = document.querySelector<HTMLElement>('main')
  if (main && last >= 0) main.style.height = tl.end[last] + vh + 'px' // the scroll runway
  update(window.scrollY)
}

/** Shows the card of the wall you are facing, fixed in place, and scrolls it inside its frame only if it is taller than the screen. */
export function update(y: number) {
  const vh = window.innerHeight
  const f = 0.3 * travel()
  const lastI = els.length - 1
  let best = -1
  let bo = 0
  els.forEach((el, i) => {
    const a = tl.start[i]
    const b = tl.end[i]
    let o = 1
    if (y < a) o = clamp(1 - (a - y) / f, 0, 1)
    else if (y > b && i !== lastI) o = clamp(1 - (y - b) / f, 0, 1)
    o = o * o * (3 - 2 * o)
    el.style.opacity = String(o)
    op[i] = o
    el.style.visibility = o < 0.01 ? 'hidden' : 'visible'
    el.style.pointerEvents = o > 0.6 ? 'auto' : 'none'
    if (i > 0) {
      const avail = vh - 2 * PAD
      const over = Math.max(0, heights[i] - avail)
      let ty = over > 0 ? PAD - clamp(y - (a + tl.base[i] * 0.5), 0, over) : (vh - heights[i]) / 2
      if (i === lastI) ty -= Math.max(0, y - b) // the last card rises away as the footer arrives
      el.style.transform = `translate3d(0,${ty}px,0)`
    }
    if (o > bo) { bo = o; best = i }
  })
  if (best >= 0 && best !== active) {
    active = best
    setMood((els[best].dataset.mood as Mood) ?? 'calm')
    if (best > 0) reveal(els[best])
  }
}
