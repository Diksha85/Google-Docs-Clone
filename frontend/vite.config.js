import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import history from 'connect-history-api-fallback'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    middlewareMode: false,
    setupMiddlewares(middlewares) {
      // Add history API fallback
      middlewares.push(
        history({
          disableDotRule: true,
          verbose: true
        })
      )
      return middlewares
    }
  }
})
