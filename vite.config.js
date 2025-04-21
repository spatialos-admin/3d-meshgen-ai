import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/3d-meshgen-ai/',
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['@react-three/fiber', 'three', 'react', 'react-dom', '@react-three/drei', 'openai']
    }
  }
})
