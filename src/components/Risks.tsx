const RISKS: [string, string][] = [
  ['Detection accuracy is unmeasured.', 'We quote no accuracy figure. Labelled sessions are being collected so held-out validation can give a verdict.'],
  ['The model is calibrated to one person.', 'Per-feature rescaling is in place, and testing with other people is the next step. Until then results for others are rough.'],
  ['Alerts could become nagging.', 'A problem must persist before anything is said, a cooldown follows every nudge, and grace periods are planned.'],
  ['A camera raises privacy concerns.', 'Video stays in memory on the device and is never saved or uploaded. There is no team view and no manager report. Escalation is off by default.'],
  ['Workload could be mistaken for a diagnosis.', 'Aura is described as an ergonomic and focus assistant, not a medical device. It estimates workload from movement and says so.'],
  ['Hardware figures may not hold.', 'Low-power numbers are modelled targets, not measurements, and are not presented as results.'],
  ['Platform coverage is narrow.', 'Linux is tested. Windows and macOS support is written but untested, and is on the roadmap.'],
]
export default function Risks() {
  return (
    <section id="risks" data-mood="unproven">
      <span className="idx m">07 — Risks</span>
      <h2 className="big">What could go wrong,<br /><em>and our answer.</em></h2>
      <div style={{ marginTop: 40 }}>
        {RISKS.map(([r, a]) => (
          <div className="rk" key={r}>
            <h3>{r}</h3>
            <div><span className="m">Our response</span><p>{a}</p></div>
          </div>
        ))}
      </div>
    </section>
  )
}
