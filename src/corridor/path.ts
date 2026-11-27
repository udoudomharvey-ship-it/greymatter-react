import * as THREE from 'three'

export const SP = 22        // distance between stations (one per section)
export const LEAD = 7       // each wall medallion sits this far ahead of its station
export const WH = 3.6       // half width of the corridor
export const HH = 2.6       // half height
export const MED_R = 2.2    // medallion radius
export const CELL = 1.6     // pattern cell size (must match the shader)
export const S0 = -30       // corridor start
const AMP = 5
const K = (Math.PI * 2) / 120

export const pathX = (s: number) => AMP * Math.sin(s * K)

export function pointAt(s: number, out = new THREE.Vector3()) {
  return out.set(pathX(s), 0, -s)
}
export function tangent(s: number, out = new THREE.Vector3()) {
  const dx = AMP * K * Math.cos(s * K)
  const l = Math.hypot(dx, 1)
  return out.set(dx / l, 0, -1 / l)
}
export function rightAt(s: number, out = new THREE.Vector3()) {
  const t = tangent(s, out)
  return out.set(-t.z, 0, t.x)
}

/** Sweeps a rounded-rectangle profile along the winding path. uv = (distance along path, distance around profile). */
export function buildCorridor(end: number, around = 180, seg = 1) {
  const e = 2 / 5
  const prof: [number, number][] = []
  const arc: number[] = [0]
  for (let j = 0; j <= around; j++) {
    const th = (j / around) * Math.PI * 2
    const c = Math.cos(th)
    const sn = Math.sin(th)
    prof.push([WH * Math.sign(c) * Math.pow(Math.abs(c), e), HH * Math.sign(sn) * Math.pow(Math.abs(sn), e)])
    if (j > 0) arc.push(arc[j - 1] + Math.hypot(prof[j][0] - prof[j - 1][0], prof[j][1] - prof[j - 1][1]))
  }
  const raw = arc[around]
  const total = Math.max(1, Math.round(raw / CELL)) * CELL // whole cells, so the pattern closes seamlessly
  const k = total / raw
  const rings = Math.ceil((end - S0) / seg)
  const stride = around + 1
  const count = (rings + 1) * stride
  const pos = new Float32Array(count * 3)
  const uv = new Float32Array(count * 2)
  const pr = new Float32Array(count * 2)
  const p = new THREE.Vector3()
  const r = new THREE.Vector3()
  for (let i = 0; i <= rings; i++) {
    const s = S0 + i * seg
    pointAt(s, p)
    rightAt(s, r)
    for (let j = 0; j <= around; j++) {
      const v = i * stride + j
      const px = prof[j][0]
      const py = prof[j][1]
      pos[v * 3] = p.x + r.x * px
      pos[v * 3 + 1] = py
      pos[v * 3 + 2] = p.z + r.z * px
      uv[v * 2] = s
      uv[v * 2 + 1] = arc[j] * k
      pr[v * 2] = px
      pr[v * 2 + 1] = py
    }
  }
  const idx: number[] = []
  for (let i = 0; i < rings; i++) {
    for (let j = 0; j < around; j++) {
      const a = i * stride + j
      const b = a + 1
      const c = a + stride
      const d = c + 1
      idx.push(a, c, b, b, c, d)
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
  geometry.setAttribute('aProf', new THREE.BufferAttribute(pr, 2))
  geometry.setIndex(idx)
  return { geometry, total }
}
