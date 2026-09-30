import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'
import { defineConfig, type Plugin } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `vite build --mode single` → one self-contained mockup/index.html (no service worker, works from file://)
const inlineFavicon = (): Plugin => ({
  name: 'inline-favicon',
  transformIndexHtml: html => {
    const svg = readFileSync('public/favicon.svg', 'utf8')
    return html
      .replace(/<link rel="apple-touch-icon"[^>]*>\s*/, '')
      .replace(/href="\.\/favicon\.svg"/, `href="data:image/svg+xml,${encodeURIComponent(svg)}"`)
  },
})

const pwa = VitePWA({
  registerType: 'autoUpdate',
  includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
  manifest: {
    name: 'KBC Safety Score',
    short_name: 'Safety Score',
    description: 'Know your risk before the hackers do. Your personal cybercrime risk score, with tips and protection.',
    theme_color: '#FFFFFF',
    background_color: '#F4F8FB',
    display: 'standalone',
    orientation: 'portrait',
    start_url: '.',
    scope: '.',
    icons: [
      { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
      { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
      { src: 'pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,svg,png}'],
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/,
        handler: 'CacheFirst',
        options: { cacheName: 'google-fonts', expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 }, cacheableResponse: { statuses: [0, 200] } },
      },
    ],
  },
})

export default defineConfig(({ mode }) => mode === 'single'
  ? {
      base: './',
      publicDir: false,
      plugins: [react(), viteSingleFile(), inlineFavicon()],
      build: { outDir: 'mockup', emptyOutDir: true },
    }
  : {
      base: './',
      plugins: [react(), pwa],
    })
