import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // Build date for the footer's "Last updated" line (updates on every deploy).
  define: {
    'import.meta.env.VITE_LAST_UPDATED': JSON.stringify(new Date().toISOString()),
  },
})
