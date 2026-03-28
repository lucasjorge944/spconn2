import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      // Source TS: Vite bundles real ESM. `dist` is CJS and breaks named imports in the browser.
      '@spce/shared': path.resolve(__dirname, '../shared/src/index.ts'),
    },
  },
  base: './',
  server: {
    port: 5173,
    strictPort: true,
  },
})
