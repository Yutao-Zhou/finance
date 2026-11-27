import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import briefAssets from './scripts/brief-assets.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), briefAssets()],
  base: '/finance/',
})
