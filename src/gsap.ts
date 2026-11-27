import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** SYS_RM: the operating system asks for reduced motion. RM: that, or the visitor switched motion off here. */
export const SYS_RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches
let pref = ''
try { pref = localStorage.getItem('gm-motion') || '' } catch { /* storage unavailable */ }
export const RM = SYS_RM || pref === 'off'
export { gsap, ScrollTrigger }
