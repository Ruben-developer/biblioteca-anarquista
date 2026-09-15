import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, mkdirSync, cpSync, existsSync } from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-pdfs',
      closeBundle() {
        const src = path.resolve(__dirname, 'pdfs-local')
        const dest = path.resolve(__dirname, 'dist', 'pdfs')
        if (existsSync(src)) {
          mkdirSync(dest, { recursive: true })
          cpSync(src, dest, { recursive: true })
          console.log('✓ PDFs copied to dist/pdfs')
        }
      }
    }
  ],
  base: '/',
  server: {
    port: 3000,
    open: true,
    proxy: {
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
