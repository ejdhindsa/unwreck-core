import { unwreck } from '@unwreck/core/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [unwreck()],
  server: {
    port: 5173,
  },
})
