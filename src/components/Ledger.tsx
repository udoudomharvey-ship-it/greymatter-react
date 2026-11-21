const CLAIM = [
  'Runs end to end as a prototype, from camera to suggestion.',
  'Video is processed in memory and never saved or uploaded.',
  'Suggestions are rule-based and come with a plain-language reason.',
  'Contacting a trusted person is off by default.',
]
const NOT = [
  'Detection accuracy. It has not been measured, so no figure is quoted.',
  'Performance on other people. The model is calibrated to one person, the founder.',
  'Pilot results. There are no pilot users yet.',
  'Hardware power figures. They are modelled targets, not measurements.',
  'Windows support. It is written but untested.',
]
const EV: [string, string, boolean?][] = [
  ['12', 'recorded sessions'], ['26,520', 'frames recorded'], ['1,215', 'frames labelled'],
  ['10', 'customer interviews'], ['0', 'pilot users', true], ['0', 'accuracy claims', true],
]
export default function Ledger() {
  return (
    <section id="ledger" data-mood="unproven">
      <span className="idx m">03 — The ledger</span>
      <h2 className="big">Claims,<br /><em>kept honest.</em></h2>
      <p className="stmt" style={{ marginTop: 0, fontSize: 'clamp(24px,3.4vw,52px)' }}>
        Most early companies hide what isn’t proven. We publish it.
      </p>
      <div className="led">
        <div className="yes"><h3>What we claim</h3><ul>{CLAIM.map((t) => <li key={t}>{t}</li>)}</ul></div>
        <div className="no"><h3>What we do not claim yet</h3><ul>{NOT.map((t) => <li key={t}>{t}</li>)}</ul></div>
      </div>
      <div className="ev">
        {EV.map(([n, l, z]) => <div key={l}><b className={z ? 'z' : ''}>{n}</b><span className="m">{l}</span></div>)}
      </div>
      <p className="m mm" style={{ marginTop: 20 }}>
        Counts come from the project archive: session recordings and the labelled dataset, and the founder’s interview log. Aura-M1 is an ergonomic and focus assistant, not a medical device.
      </p>
    </section>
  )
}
