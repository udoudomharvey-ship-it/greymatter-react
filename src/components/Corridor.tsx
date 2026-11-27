import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { RM } from '../gsap'
import { mood } from '../mood'
import { tl, op } from '../walls'
import { SP, WH, HH, buildCorridor, pointAt, rightAt, tangent } from '../corridor/path'
import { VERT, FRAG } from '../corridor/shaders'

// Dark: bluish-grey walls, mint accent. Light: white walls, darker mint accent.
const PAL = {
  dark: { bg: new THREE.Color('#0f151c'), base: new THREE.Color('#161e27'), mint: new THREE.Color('#6fffb0'), amb: new THREE.Color('#ffb454') },
  light: { bg: new THREE.Color('#f3f5f2'), base: new THREE.Color('#f6f8f6'), mint: new THREE.Color('#0a7a50'), amb: new THREE.Color('#a35f00') },
}
const FW = 5.6 // framed piece width (world units)
const FH = 2.8 // framed piece height
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x))
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}
const sideOf = (i: number) => (i % 2 === 0 ? 1 : -1)

/** Where the camera stands (s), how squarely it faces a wall (w: 0 walking ahead, 1 head-on) and which wall (side). */
function pose(y: number) {
  const { start, end } = tl
  const n = start.length
  if (n < 2 || y <= end[0]) return { s: 0, w: 0, side: 1 }
  for (let i = 0; i < n - 1; i++) {
    if (y < start[i + 1]) {
      const u = clamp((y - end[i]) / Math.max(1, start[i + 1] - end[i]), 0, 1)
      const s = i * SP + SP * smooth(0.12, 0.88, u)
      if (u < 0.5) return { s, w: (i === 0 ? 0 : 1) * (1 - smooth(0, 0.3, u)), side: sideOf(i) }
      return { s, w: smooth(0.7, 1, u), side: sideOf(i + 1) }
    }
    if (y <= end[i + 1]) return { s: (i + 1) * SP, w: 1, side: sideOf(i + 1) }
  }
  return { s: (n - 1) * SP, w: 1, side: sideOf(n - 1) }
}

// ---- framed pieces ---------------------------------------------------------
type Info = { num: string; label: string; title: string; amber: number }
type Frame = {
  group: THREE.Group; cv: HTMLCanvasElement; tex: THREE.CanvasTexture; info: Info
  face: THREE.ShaderMaterial; border: THREE.ShaderMaterial; shadow: THREE.ShaderMaterial
}

const FV = /* glsl */ `
varying vec2 vUv;
varying vec3 vPos;
void main(){
  vUv = uv;
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vPos = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`
const FF = /* glsl */ `
precision highp float;
uniform sampler2D uMap;
uniform vec3 uColor, uBg;
uniform float uUseMap, uOpacity, uShadow;
varying vec2 vUv;
varying vec3 vPos;
void main(){
  float d = distance(vPos, cameraPosition);
  float fog = 1.0 - exp(-d * 0.03);
  vec3 c = uUseMap > 0.5 ? texture2D(uMap, vUv).rgb : uColor;
  float a = uOpacity;
  if (uShadow > 0.5) {
    vec2 e = abs(vUv - 0.5) * 2.0;
    a = uOpacity * (1.0 - smoothstep(0.55, 1.0, max(e.x, e.y)));
  }
  c = mix(c, uBg, fog);
  gl_FragColor = vec4(c, a);
  #include <colorspace_fragment>
}`

function readInfo(el: HTMLElement): Info {
  const idx = el.querySelector('.idx')?.textContent ?? ''
  const [num = '', label = ''] = idx.split('—').map((x) => x.trim())
  const h2 = el.querySelector('h2')
  let title = h2 ? h2.innerHTML.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '') : ''
  if (!title.trim()) title = (el.querySelector('.stmt')?.textContent ?? '').split('. ')[0]
  if (!title.trim()) title = label
  return { num, label, title: title.replace(/\s+/g, ' ').trim(), amber: el.dataset.mood === 'unproven' ? 1 : 0 }
}

function wrap(g: CanvasRenderingContext2D, text: string, maxW: number) {
  const lines: string[] = []
  let cur = ''
  text.split(' ').forEach((w) => {
    const t = cur ? cur + ' ' + w : w
    if (g.measureText(t).width > maxW && cur) { lines.push(cur); cur = w } else cur = t
  })
  if (cur) lines.push(cur)
  return lines
}

/** Paints the face of a framed piece: outlined numeral, section label, and title. */
function paint(f: Frame, dark: boolean) {
  const g = f.cv.getContext('2d')
  if (!g) return
  const W = f.cv.width
  const H = f.cv.height
  const ink = dark ? '#e9edea' : '#0b1016'
  const line = dark ? '#2b3844' : '#cdd5d0'
  const acc = f.info.amber ? (dark ? '#ffb454' : '#a35f00') : (dark ? '#6fffb0' : '#0a7a50')
  g.fillStyle = dark ? '#131a22' : '#fbfcfb'
  g.fillRect(0, 0, W, H)
  g.strokeStyle = line
  g.lineWidth = 2
  g.strokeRect(22, 22, W - 44, H - 44)
  g.textBaseline = 'alphabetic'
  g.textAlign = 'right'
  g.font = '600 340px "Space Grotesk Variable", sans-serif'
  g.lineWidth = 3
  g.strokeText(f.info.num, W - 50, 340)
  g.textAlign = 'left'
  g.fillStyle = acc
  g.font = '500 24px "IBM Plex Mono", monospace'
  g.fillText((f.info.num + ' — ' + f.info.label).toUpperCase(), 60, 84)
  let size = 80
  let lines: string[] = []
  for (; size >= 44; size -= 6) {
    g.font = '600 ' + size + 'px "Space Grotesk Variable", sans-serif'
    lines = wrap(g, f.info.title, W - 120)
    if (lines.length * size * 1.08 <= 250) break
  }
  g.fillStyle = ink
  const y0 = H - 60 - (lines.length - 1) * size * 1.08
  lines.forEach((l, i) => g.fillText(l, 60, y0 + i * size * 1.08))
  f.tex.needsUpdate = true
}

function makeFrame(info: Info, section: number, uBg: THREE.Color, geos: { face: THREE.PlaneGeometry; border: THREE.PlaneGeometry; shadow: THREE.PlaneGeometry }): Frame {
  const cv = document.createElement('canvas')
  cv.width = 1024
  cv.height = 512
  const tex = new THREE.CanvasTexture(cv)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  const mat = (useMap: number, shadow: number, order: number, offset: boolean) => {
    const m = new THREE.ShaderMaterial({
      vertexShader: FV,
      fragmentShader: FF,
      transparent: true,
      depthWrite: false,
      polygonOffset: offset,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
      uniforms: {
        uMap: { value: tex }, uColor: { value: new THREE.Color('#000000') }, uBg: { value: uBg },
        uUseMap: { value: useMap }, uOpacity: { value: 1 }, uShadow: { value: shadow },
      },
    })
    m.userData.order = order
    return m
  }
  const face = mat(1, 0, 3, true)
  const border = mat(0, 0, 2, true)
  const shadow = mat(0, 1, 1, false)
  const group = new THREE.Group()
  ;([[geos.shadow, shadow, 0], [geos.border, border, 0.03], [geos.face, face, 0.036]] as const).forEach(([geo, m, z]) => {
    const mesh = new THREE.Mesh(geo, m)
    mesh.position.z = z
    mesh.renderOrder = m.userData.order
    mesh.frustumCulled = false
    group.add(mesh)
  })
  // hang it on the wall of its section, turned to face the middle of the hallway
  const side = sideOf(section)
  const s = section * SP
  const t = tangent(s)
  group.position.copy(pointAt(s)).addScaledVector(rightAt(s), side * (WH - 0.1))
  group.rotation.y = Math.atan2(-t.x, -t.z) + (side > 0 ? -Math.PI / 2 : Math.PI / 2)
  return { group, cv, tex, info, face, border, shadow }
}

function Scene({ count }: { count: number }) {
  const end = (count - 1) * SP + 70
  const world = useMemo(() => {
    const { geometry, total } = buildCorridor(end)
    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 }, uDark: { value: 1 }, uAmber: { value: 0 }, uTotal: { value: total }, uSP: { value: SP },
        uHh: { value: HH }, uPulse: { value: RM ? 0 : 1 }, uCount: { value: count },
        uBg: { value: PAL.dark.bg.clone() }, uBase: { value: PAL.dark.base.clone() },
        uMint: { value: PAL.dark.mint.clone() }, uAmb: { value: PAL.dark.amb.clone() },
      },
    })
    const mesh = new THREE.Mesh(geometry, mat)
    mesh.frustumCulled = false

    const geos = {
      face: new THREE.PlaneGeometry(FW, FH),
      border: new THREE.PlaneGeometry(FW + 0.16, FH + 0.16),
      shadow: new THREE.PlaneGeometry(FW + 1.4, FH + 1.4),
    }
    const secs = Array.from(document.querySelectorAll<HTMLElement>('main > section'))
    const frames: Frame[] = []
    for (let i = 1; i < count; i++) {
      const el = secs[i]
      if (el) frames.push(makeFrame(readInfo(el), i, mat.uniforms.uBg.value, geos))
    }
    return { mesh, mat, geometry, frames, geos }
  }, [count, end])

  useEffect(() => () => {
    world.geometry.dispose()
    world.mat.dispose()
    Object.values(world.geos).forEach((g) => g.dispose())
    world.frames.forEach((f) => { f.tex.dispose(); f.face.dispose(); f.border.dispose(); f.shadow.dispose() })
  }, [world])

  const st = useRef({ D: 0, amber: 0, dark: 1, t: 0, px: 0, py: 0, painted: -1, dir: new THREE.Vector3(0, 0, -1) })
  const ptr = useRef({ x: 0, y: 0 })
  const tmp = useMemo(() => ({
    P: new THREE.Vector3(), F: new THREE.Vector3(), W: new THREE.Vector3(), Dt: new THREE.Vector3(),
    rt: new THREE.Vector3(), T: new THREE.Vector3(), UP: new THREE.Vector3(0, 1, 0), c: new THREE.Color(),
  }), [])

  useEffect(() => {
    const mv = (e: PointerEvent) => {
      ptr.current.x = (e.clientX / window.innerWidth) * 2 - 1
      ptr.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', mv)
    document.fonts.ready.then(() => { st.current.painted = -1 }) // repaint the frames once the fonts are in
    return () => window.removeEventListener('pointermove', mv)
  }, [])

  useFrame((state, delta) => {
    const s = st.current
    const u = world.mat.uniforms
    const dt = Math.min(delta, 0.05)
    if (!RM) s.t += dt
    const k = RM ? 1 : 1 - Math.exp(-dt * 6)

    // theme and mood
    const dark = document.documentElement.dataset.theme !== 'light'
    const pal = dark ? PAL.dark : PAL.light
    s.dark += ((dark ? 1 : 0) - s.dark) * k
    s.amber += (mood.tk - s.amber) * k
    u.uBg.value.lerp(pal.bg, k)
    u.uBase.value.lerp(pal.base, k)
    u.uMint.value.lerp(pal.mint, k)
    u.uAmb.value.lerp(pal.amb, k)
    u.uTime.value = s.t
    u.uDark.value = s.dark
    u.uAmber.value = s.amber
    state.gl.setClearColor(u.uBg.value)

    // framed pieces: repaint on theme change, cross-fade into the readable card as it appears
    const want = dark ? 1 : 0
    if (s.painted !== want) { world.frames.forEach((f) => paint(f, dark)); s.painted = want }
    world.frames.forEach((f, i) => {
      const card = op[i + 1] ?? 0
      f.face.uniforms.uOpacity.value = clamp(1 - card * 1.1, 0, 1)
      f.border.uniforms.uColor.value.copy(u.uMint.value).lerp(u.uAmb.value, f.info.amber)
      f.shadow.uniforms.uOpacity.value = dark ? 0.5 : 0.22
    })

    // where to stand and what to face
    const pz = pose(window.scrollY)
    s.D += (pz.s - s.D) * (RM ? 1 : 1 - Math.exp(-dt * 4))
    s.px += (ptr.current.x - s.px) * k * 0.5
    s.py += (ptr.current.y - s.py) * k * 0.5

    const cam = state.camera as THREE.PerspectiveCamera
    const aspect = state.size.width / state.size.height
    const fov = aspect < 1 ? 70 : 58
    if (cam.fov !== fov) { cam.fov = fov; cam.updateProjectionMatrix() }

    const { P, F, W, Dt, rt, T, UP } = tmp
    pointAt(s.D, P)
    tangent(s.D, F)
    rightAt(s.D, W).multiplyScalar(pz.side)
    Dt.copy(F).multiplyScalar(1 - pz.w).addScaledVector(W, pz.w).normalize()
    s.dir.lerp(Dt, RM ? 1 : 1 - Math.exp(-dt * 5)).normalize()

    // facing a piece, stand back far enough that it fills about the width of its card
    const vw = state.size.width
    const half = Math.tan((fov * Math.PI) / 360)
    const frac = clamp((Math.min(780, vw - 28) * 1.12) / vw, 0.3, 0.95)
    const dist = FW / frac / (2 * half * aspect)
    const lat = Math.max(-(WH - 0.6), WH - 0.14 - dist) * pz.w

    rt.crossVectors(s.dir, UP).normalize()
    const bob = RM ? 0 : Math.sin(s.t * 0.9) * 0.03
    cam.position.copy(P).addScaledVector(rt, s.px * 0.15).addScaledVector(W, lat).setY(s.py * 0.08 + bob)
    T.copy(cam.position).addScaledVector(s.dir, 8)
    cam.lookAt(T)
  })

  return (
    <>
      <primitive object={world.mesh} />
      {world.frames.map((f, i) => <primitive key={i} object={f.group} />)}
    </>
  )
}

class Boundary extends Component<{ children: ReactNode; onFail: () => void }, { bad: boolean }> {
  state = { bad: false }
  static getDerivedStateFromError() { return { bad: true } }
  componentDidCatch() { this.props.onFail() }
  render() { return this.state.bad ? null : this.props.children }
}

function hasGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch { return false }
}

export default function Corridor() {
  const [ok] = useState(hasGL)
  const [on, setOn] = useState(false)
  const [count] = useState(() => document.querySelectorAll('main > section').length || 10)
  const save = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
  const off = !ok || !!save
  useEffect(() => { if (off) document.documentElement.classList.add('no3d') }, [off])
  if (off) return null
  const mobile = window.innerWidth < 800
  return (
    <div id="gl" className={on ? 'on' : ''} aria-hidden="true">
      <Boundary onFail={() => document.documentElement.classList.add('no3d')}>
        <Canvas
          dpr={mobile ? [1, 1.25] : [1, 1.6]}
          camera={{ fov: 58, near: 0.1, far: 150 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          onCreated={() => setOn(true)}
        >
          <Scene count={count} />
        </Canvas>
      </Boundary>
    </div>
  )
}
