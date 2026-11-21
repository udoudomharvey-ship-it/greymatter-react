type Row = [string, string, string, 'ok' | 'wip' | 'in']
const ROWS: Row[] = [
  ['Pose', 'MediaPipe tracks body joints from an ordinary webcam. Frames are held in memory and discarded.', 'Built', 'ok'],
  ['Entropy (HEMM)', 'Joint motion becomes three numbers: spatial entropy across 12 sectors, temporal entropy from velocity histograms, and inter-joint entropy from co-movement.', 'Built', 'ok'],
  ['Scoring', 'A 1-bit neural network (3 inputs, 16 hidden, 5 outputs) turns the three numbers into an interaction-quality score and a five-level workload estimate.', 'Prototype', 'wip'],
  ['Detection', 'A threshold detector acts only on a decline that persists, so a single spike never triggers anything.', 'Built', 'ok'],
  ['Recommendation', 'A rule table picks the action, a plain-language layer explains it, a contextual bandit learns which resets help, and escalation to a trusted person is consent-based.', 'Built', 'ok'],
  ['Voice', 'A hands-free “Hey Aura” mode with offline speech recognition and spoken nudges. An AI model writes the wording from a text label only, never video or body data.', 'Optional', 'in'],
  ['Rust core and firmware', 'A performance core mirrors the entropy and network maths, with a firmware sketch for a low-power hardware direction.', 'Untested', 'wip'],
  ['Verification', 'Golden test vectors pin the entropy and network outputs, alongside an automated test suite.', 'Built', 'ok'],
]
export default function Technology() {
  return (
    <section id="tech" data-mood="calm">
      <span className="idx m">03 — Technology</span>
      <h2 className="big">Eight layers,<br /><em>one quiet loop.</em></h2>
      <div style={{ marginTop: 40 }}>
        {ROWS.map(([h, p, t, c], i) => (
          <div className="tr" key={h}>
            <span className="no">{String(i + 1).padStart(2, '0')}</span>
            <h3>{h}</h3><p>{p}</p><span className={`tag ${c}`}>{t}</span>
          </div>
        ))}
      </div>
      <p className="m mm" style={{ marginTop: 20 }}>The demo and public simulation use a placeholder model. The live model is calibrated to one person.</p>
    </section>
  )
}
