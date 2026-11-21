const ITEMS = [
  ['Private by construction.', 'Camera frames are processed in memory and discarded. The local dashboard listens only on your own machine.'],
  ['Explainable, not mysterious.', 'Suggestions come from deterministic rules with a plain-language reason attached. No black-box coaching.'],
  ['Quiet by default.', 'Aura waits for a decline that persists, then cools down. Nagging is treated as a failure mode.'],
  ['Consent before anything else.', 'Reaching out to a trusted person is off by default and needs contacts you choose yourself.'],
]
export default function Principles() {
  return (
    <section id="principles" data-mood="calm">
      <span className="idx m">06 — Principles</span>
      <div style={{ marginTop: 70 }}>
        {ITEMS.map(([h, p], i) => (
          <article className="pr" key={h}>
            <span className="n" aria-hidden="true">{i + 1}</span>
            <div><h3>{h}</h3><p>{p}</p></div>
          </article>
        ))}
      </div>
    </section>
  )
}
