/** Dark is the identity; light is optional. The choice is stored only in this browser. */
type Theme = 'dark' | 'light'
function read(): Theme {
  try { return localStorage.getItem('gm-theme') === 'light' ? 'light' : 'dark' } catch { return 'dark' }
}
export function applyTheme(t: Theme) {
  document.documentElement.dataset.theme = t
  try { localStorage.setItem('gm-theme', t) } catch { /* ignore */ }
  window.dispatchEvent(new Event('gm-theme'))
}
export function toggleTheme() {
  applyTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light')
}
document.documentElement.dataset.theme = read()
