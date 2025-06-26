import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: ['buffer', 'react', 'react-dom'], // ensure React is correctly bundled
  },
  resolve: {
    alias: {
      buffer: 'buffer/', // trailing slash ensures proper resolution
    },
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/], // broadened to avoid CJS issues with react
    },
  },
})
