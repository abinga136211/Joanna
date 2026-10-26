import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
function faviconRootFallback() {
  return {
    name: 'favicon-root-fallback',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const url = req.url || ''
        if (url === '/favicon.ico' || url.startsWith('/favicon.ico?')) {
          req.url = '/Joanna/adg-favicon-v6.ico'
        }
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    faviconRootFallback(),
  ],
  base: '/Joanna/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.VITE_DEV_API_PORT || process.env.PORT || 3003}`,
        changeOrigin: true,
      },
    },
  },
})
