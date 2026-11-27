import { useState, type FormEvent } from 'react'

const EP = import.meta.env.VITE_FORM_ENDPOINT as string | undefined
const MAIL = 'udoudomharvey@gmail.com'

/** With VITE_FORM_ENDPOINT set it posts to your form service; otherwise it opens a pre-filled email. */
export default function InterestForm() {
  const [st, setSt] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = e.currentTarget
    const d = Object.fromEntries(new FormData(f).entries()) as Record<string, string>
    if (d.website) return // honeypot: real visitors never fill this
    if (!EP) {
      const body = encodeURIComponent(`Name: ${d.name || ''}\nEmail: ${d.email}\nI am: ${d.role}\n\n${d.msg || ''}`)
      location.href = `mailto:${MAIL}?subject=${encodeURIComponent('Aura-M1: ' + d.role)}&body=${body}`
      setSt('done')
      return
    }
    setSt('sending')
    try {
      const r = await fetch(EP, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(d) })
      if (r.ok) { setSt('done'); f.reset() } else setSt('error')
    } catch { setSt('error') }
  }

  return (
    <form className="fm" onSubmit={submit}>
      <h3>Stay in touch, or take part</h3>
      <p className="m mm">For updates, investor and accelerator conversations, or validation sessions.</p>
      <label>Name (optional)<input name="name" autoComplete="name" /></label>
      <label>Email<input name="email" type="email" required autoComplete="email" /></label>
      <label>I am a
        <select name="role" defaultValue="Investor">
          <option>Investor</option><option>Accelerator or programme</option>
          <option>Possible validation partner</option><option>Send me updates</option><option>Other</option>
        </select>
      </label>
      <label>Message (optional)<textarea name="msg" rows={3} /></label>
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: -9999 }} />
      <button className="btn" type="submit" disabled={st === 'sending'}>{st === 'sending' ? 'Sending…' : 'Send'}</button>
      <p className="m mm" role="status">
        {st === 'done' && (EP ? 'Thank you. Your message was sent.' : 'Your email app should have opened with the message ready to send.')}
        {st === 'error' && 'That did not send. Please email udoudomharvey@gmail.com directly.'}
      </p>
    </form>
  )
}
