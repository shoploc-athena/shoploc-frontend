import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    // Génère le service worker Workbox pour le mode hors ligne
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        // Ne jamais mettre les appels API en cache
        navigateFallbackDenylist: [/^\/api/],
      },
      manifest: {
        name: 'ShopLoc',
        short_name: 'ShopLoc',
        display: 'standalone',
        theme_color: '#ffffff',
      },
    }),
  ],
  server: {
    // En développement, /api est redirigé vers le store-service
    proxy: { '/api': 'http://localhost:8080' },
  },
  test: { environment: 'node' },
});