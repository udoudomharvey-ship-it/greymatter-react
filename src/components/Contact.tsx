import { useState } from 'react'
import InterestForm from './InterestForm'

const LINKEDIN = 'https://www.linkedin.com/in/harvey-frederick-269772241?utm_source=share_via&utm_content=profile&utm_medium=member_android'
const MAIL = 'udoudomharvey@gmail.com'
const SUBJECT = encodeURIComponent('Aura-M1: investor / accelerator enquiry')

function Copy({ text, label }: { text: string; label: string }) {
  const [ok, setOk] = useState(false)
  return (
    <button className="cp" aria-label={`Copy ${label}`} onClick={() => {
      navigator.clipboard?.writeText(text).then(() => { setOk(true); setTimeout(() => setOk(false), 1600) })
    }}>{ok ? 'Copied' : 'Copy'}</button>
  )
}

export default function Contact() {
  return (
    <section id="contact" data-mood="settled">
      <span className="idx m">09 — Contact</span>
      <h2>Speak with the founder.</h2>
      <p className="stmt" style={{ marginTop: 0, marginBottom: 36, fontSize: 'clamp(22px,2.6vw,38px)' }}>
        For investors and accelerators: a direct conversation about what is built, what is unproven, and what the next validation step costs.
      </p>
      <a className="btn" href={`mailto:${MAIL}?subject=${SUBJECT}`}>Start the conversation</a>
      <div style={{ marginTop: 34 }}>
        <div className="cr"><a className="cl" href={`mailto:${MAIL}`}><span>Email</span>{MAIL}</a><Copy text={MAIL} label="email address" /></div>
        <div className="cr"><a className="cl" href="tel:+2348153214585"><span>Telephone</span>+234 815 321 4585</a><Copy text="+2348153214585" label="phone number" /></div>
        <div className="cr"><a className="cl" href={LINKEDIN} target="_blank" rel="noopener noreferrer"><span>LinkedIn</span>Harvey Udoudom ↗</a></div>
      </div>
      <p className="m mm" style={{ marginTop: 22 }} role="status">Harvey Udoudom, Chief Executive Officer. We are also looking for validation partners: people willing to label focused and distracted sessions across several days.</p>
      <InterestForm />
    </section>
  )
}
