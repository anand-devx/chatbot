import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
 build: {
    commonjsOptions: {
      include: ['node_modules/buffer/index.js'],
    },
  },
  resolve: {
    alias: {
      buffer: 'buffer', // ensure correct path resolution
    },
  },
})


