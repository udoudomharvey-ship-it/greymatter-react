/** A still of Aura's calm workload ring, redrawn from the product's own design tokens (aura.html).
 *  Illustrative, not a live reading. */
const W = ['#f0704f', '#f0a24a', '#37c3ab', '#62a2ee', '#948fee']
export default function AuraStill() {
  const C = 2 * Math.PI * 90, seg = C / 5
  return (
    <figure className="still">
      <svg viewBox="0 0 240 240" role="img" aria-label="Aura-M1 workload ring, showing a moderate workload estimate">
        <circle cx="120" cy="120" r="76" fill="#37c3ab" opacity=".12" />
        {W.map((c, i) => (
          <circle key={c} cx="120" cy="120" r="90" fill="none" stroke={c} strokeWidth={i === 2 ? 12 : 6}
            strokeLinecap="round" strokeDasharray={`${seg - 10} ${C - seg + 10}`}
            transform={`rotate(${i * 72 - 90} 120 120)`} opacity={i === 2 ? 1 : 0.35} />
        ))}
        <text x="120" y="118" textAnchor="middle" fill="#edf1f6" fontFamily="Space Grotesk Variable, sans-serif" fontSize="22" fontWeight="600">Moderate</text>
        <text x="120" y="140" textAnchor="middle" fill="#8a95a3" fontFamily="IBM Plex Mono, monospace" fontSize="9" letterSpacing="1.4">WORKLOAD ESTIMATE</text>
      </svg>
      <figcaption className="m mm">Aura’s interface, redrawn from its design tokens. An illustrative still, not a live reading.</figcaption>
    </figure>
  )
}
