import { defineConfig } from 'vite';

// Simplified config for development only
// Production uses static files without build
export default defineConfig({
  base: '/Wedding-Invitation/',
  server: {
    port: 3000,
    open: true
  },
  build: {
    // Build is disabled for production
    // Site is deployed as static files
    outDir: 'dist-unused',
    emptyOutDir: false
  }
});