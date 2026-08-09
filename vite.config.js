import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/biblioteca-anarquista/',
  server: {
    port: 3000,
    open: true,
    proxy: {
      // Enmascara el servidor de PDFs interno: la app solo ve /pdfs/...
      // y Vite reenvía a la IP local (no expuesta en el código ni en el bundle).
      '/pdfs': {
        target: 'http://192.168.1.117:8081',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild'
  },
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['lcov', 'text-summary'],
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/**/*.test.{js,jsx}', 'src/data/**', 'src/main.jsx']
    }
  }
})
