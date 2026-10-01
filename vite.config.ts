import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base path: required so the built app works from any Netlify
// subdomain/subpath without hardcoding a URL.
export default defineConfig({
  base: './',
  plugins: [react()],
})
