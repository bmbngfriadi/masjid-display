import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}']
      },
      manifest: {
        name: 'Panel Admin Masjid',
        short_name: 'Panel Admin',
        description: 'Sistem Informasi Masjid Baitul Jannah',
        theme_color: '#047857',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/masjid/admin/',
        scope: '/masjid/',
        icons: [
          {
            src: 'pwa-maskable-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'pwa-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  },
  base: '/masjid/',
  server: {
    port: 5179,
    strictPort: true,
    proxy: {
      '/masjid/api': {
        target: 'http://localhost:4001',
        changeOrigin: true
      },
      '/masjid/socket.io': {
        target: 'http://localhost:4001',
        ws: true,
        changeOrigin: true
      }
    }
  }
})
