import { useEffect } from 'react'
import { gsap, ScrollTrigger, RM } from './gsap'
import { setMood, type Mood } from './mood'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import Field from './components/Field'
import Wordmark from './components/Wordmark'
import Statement from './components/Statement'
import AuraStill from './components/AuraStill'
import Ledger from './components/Ledger'
import Principles from './components/Principles'
import Contact from './components/Contact'
import Technology from './components/Technology'
import Roadmap from './components/Roadmap'
import Risks from './components/Risks'
import Team from './components/Team'

export default function App() {
  useSmoothScroll()

  useEffect(() => {
    // the field takes the mood of whichever section holds the middle of the screen
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setMood((e.target as HTMLElement).dataset.mood as Mood)),
      { rootMargin: '-45% 0px -45% 0px' },
    )
    document.querySelectorAll('[data-mood]').forEach((s) => io.observe(s))
    let ctx: gsap.Context | undefined
    if (!RM) ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.idx,.big,.tbl div,.led li,.ev div,.pr,.still,.note,.cr,.tr,.rk,.tm').forEach((e) =>
        gsap.from(e, { opacity: 0, y: 36, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: e, start: 'top 92%' } }))
    })
    document.fonts.ready.then(() => ScrollTrigger.refresh())
    return () => { io.disconnect(); ctx?.revert() }
  }, [])

  return (
    <>
      <a className="skip" href="#company">Skip to content</a>
      <Field />
      <nav aria-label="Primary"><b>GreyMatter</b><div>
        <a href="#company">Company</a><a href="#prod">Aura-M1</a><a href="#tech">Technology</a><a href="#ledger">Ledger</a><a href="#roadmap">Roadmap</a><a href="#risks">Risks</a><a href="#team">Team</a><a href="#contact">Contact</a>
      </div></nav>
      <main>
        <section id="hero" data-mood="calm">
          <Wordmark />
          <div className="row">
            <p>Where intelligence begins. A founder-led technology company building quiet, private tools for how people work with machines.</p>
            <span className="m">Aura-M1 · Early prototype</span>
          </div>
        </section>

        <section id="company" data-mood="calm">
          <span className="idx m">01 — Company</span>
          <Statement text="GreyMatter builds technology that pays attention to people without watching them. Our first product senses when focus is slipping, then offers a single, gentle reset." />
          <p className="note">“Aura-M1 is a working prototype, and so far it has been tuned to one person: me. That is its limit. The next step is to test it on other people and publish what we find, whatever it shows.”</p>
          <p className="m mm">Harvey Udoudom, Chief Executive Officer. GreyMatter’s first product grew out of research begun at the University of Uyo and is being developed through the iDICE Startup Bridge Founders Lab.</p>
        </section>

        <section id="prod" data-mood="calm">
          <span className="idx m">02 — Product</span>
          <h2 className="big" aria-label="Aura-M1">Aura<em>-M1</em></h2>
          <div className="pg">
            <div>
              <p className="stmt" style={{ marginTop: 0, fontSize: 'clamp(24px,3.2vw,48px)' }}>A private way to notice when your focus is slipping, using only the webcam you already own.</p>
              <div className="tbl">
                <div><span className="m">Needs</span><p>An ordinary webcam and your own computer.</p></div>
                <div><span className="m">Stays</span><p>On your device. Video is never saved or uploaded.</p></div>
                <div><span className="m">Speaks</span><p>Only after a sustained change, with one short, explained suggestion.</p></div>
                <div><span className="m">Never</span><p>Reports to an employer. There is no team view and no manager report.</p></div>
              </div>
            </div>
            <AuraStill />
          </div>
        </section>

        <Technology />
        <Ledger />
        <Roadmap />
        <Principles />
        <Risks />
        <Team />
        <Contact />
      </main>
      <footer className="m">
        <span>© 2026 GreyMatter Inc. · No cookies, no analytics, fonts served from this site.</span>
        <a href="#hero">Back to top ↑</a>
      </footer>
    </>
  )
}
