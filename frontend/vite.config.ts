import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// En développement, /api/* est relayé vers le serveur de backend-api/ (port 3001 par défaut).
const apiTarget = process.env.API_PROXY_TARGET ?? 'http://localhost:3001'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Les images sont servies telles quelles depuis public/ ; rien à inliner.
    assetsInlineLimit: 0,
  },
  server: {
    proxy: { '/api': { target: apiTarget, changeOrigin: false } },
  },
})
