export type Mood = 'calm' | 'unproven' | 'settled'
const M: Record<Mood, [number, number, number]> = {
  calm: [1, 0, 0],        // mint, steady
  unproven: [1.9, 0.7, 1], // amber, loosened, slightly unsettled
  settled: [0.55, 0, 0],   // mint, quiet
}
export const mood = { a: 1, j: 0, k: 0, ta: 1, tj: 0, tk: 0 }
export function setMood(n: Mood) { [mood.ta, mood.tj, mood.tk] = M[n] }
