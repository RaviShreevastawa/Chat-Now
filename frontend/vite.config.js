import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  build: {
    outDir: 'dist', // default, but good to be explicit
  },
  server: {
    port: 5173,     // optional, local only
    open: true,
  },
});
