import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './theme'
import '@fontsource-variable/space-grotesk'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import './styles.css'
import './corridor.css'
import App from './App'

// Optional, cookie-free visit counts. Only loads when VITE_GC_CODE (your GoatCounter site code) is set at build time.
const gc = import.meta.env.VITE_GC_CODE as string | undefined
if (gc) {
  const s = document.createElement('script')
  s.async = true
  s.src = 'https://gc.zgo.at/count.js'
  s.dataset.goatcounter = `https://${gc}.goatcounter.com/count`
  document.head.appendChild(s)
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
