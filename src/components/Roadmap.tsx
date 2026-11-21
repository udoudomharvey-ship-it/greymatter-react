type Row = [string, string, string, 'ok' | 'wip' | 'in']
const ROWS: Row[] = [
  ['Working prototype', 'Camera to suggestion, end to end, with optional voice and an edge-glow alert.', 'Done', 'ok'],
  ['Validate on real sessions', 'Label focused and distracted stretches across several days and more than one person, test on held-out data, then publish the result whatever it shows.', 'Next', 'wip'],
  ['Calmer nudges', 'Grace periods that wait during deep, still thought, and quiet hours that switch nudges off for a time window.', 'Planned', 'in'],
  ['Learn from feedback', '“Done” and “Not now” buttons, so Aura learns which resets actually help.', 'Planned', 'in'],
  ['Resource monitor', 'Show CPU and battery use, and pause on low battery. Requested in customer interviews.', 'Planned', 'in'],
  ['More platforms', 'Test the written Windows and macOS support on real machines.', 'Planned', 'in'],
  ['Measure the hardware direction', 'Test the modelled low-power figures on real hardware before making any claim about them.', 'Research', 'in'],
]
export default function Roadmap() {
  return (
    <section id="roadmap" data-mood="calm">
      <span className="idx m">05 — Roadmap</span>
      <h2 className="big">What’s next,<br /><em>in order.</em></h2>
      <p className="stmt" style={{ marginTop: 0, fontSize: 'clamp(24px,3.4vw,52px)' }}>Validation comes before features, because nothing else matters if the detection doesn’t hold up.</p>
      <div style={{ marginTop: 40 }}>
        {ROWS.map(([h, p, t, c], i) => (
          <div className="tr" key={h}>
            <span className="no">{String(i + 1).padStart(2, '0')}</span>
            <h3>{h}</h3><p>{p}</p><span className={`tag ${c}`}>{t}</span>
          </div>
        ))}
      </div>
      <p className="m mm" style={{ marginTop: 20 }}>No dates are given, because none are committed. Stages are ordered by dependency.</p>
    </section>
  )
}
