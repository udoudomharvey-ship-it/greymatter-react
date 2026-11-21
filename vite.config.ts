import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// './' lets the build work at any path: a GitHub Pages subpath now, a custom domain later.
export default defineConfig({ base: './', plugins: [react()] })
