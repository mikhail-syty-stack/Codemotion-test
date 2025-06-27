import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // Needed for Docker
    port: 3000, // Match the port in docker-compose.yml
    watch: {
      usePolling: true // Better performance for Docker on some systems
    }
  }
})
