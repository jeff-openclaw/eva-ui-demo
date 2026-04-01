import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/eva-ui-demo/',
  plugins: [react()],
  resolve: {
    alias: {
      'eva-ui': path.resolve(__dirname, '../eva-ui/src'),
    },
  },
})
