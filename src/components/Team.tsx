const LINKEDIN = 'https://www.linkedin.com/in/harvey-frederick-269772241?utm_source=share_via&utm_content=profile&utm_medium=member_android'
export default function Team() {
  return (
    <section id="team" data-mood="calm">
      <span className="idx m">08 — Team</span>
      <div className="tm">
        <h2 className="big" style={{ margin: '60px 0 20px' }}>Harvey<br /><em>Udoudom</em></h2>
        <div>
          <p className="m" style={{ color: 'var(--sig)' }}>Founder and Chief Executive Officer</p>
          <p className="stmt" style={{ marginTop: 14, fontSize: 'clamp(22px,2.8vw,40px)' }}>
            Author of the Aura-M1 prototype, from the pose pipeline and entropy features to the network, the recommender and the voice layer.
          </p>
          <p style={{ maxWidth: 560, color: 'var(--body)' }}>
            The work began as research at the University of Uyo in 2025 and is now developed through the iDICE Startup Bridge Founders Lab.
          </p>
          <a className="btn" href={LINKEDIN} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
        </div>
      </div>
    </section>
  )
}
