///<reference types="vitest" />

import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
  },
  css: {
    postcss: './postcss.config.cjs',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    strictPort: true
  },
  build: {
    // Optimizaciones para producción
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar las dependencias más grandes en chunks separados
          vendor: ['vue', 'vue-router', 'pinia'],
          charts: ['echarts'],
          icons: ['lucide-vue-next'],
          utils: ['axios', 'jwt-decode']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false 
  },
  // Configuración para preview de producción
  preview: {
    port: 4173,
    strictPort: true
  }
})