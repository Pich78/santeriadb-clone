import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Configurazione per GitHub Pages
  base: '/santeriadb-clone/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react'],
          search: ['fuse.js'],
          markdown: ['marked', 'gray-matter']
        }
      }
    }
  },
  // Configurazione per il server di sviluppo
  server: {
    port: 5173,
    host: true,
    open: false
  },
  // Configurazione per l'anteprima
  preview: {
    port: 4173,
    host: true
  }
})
