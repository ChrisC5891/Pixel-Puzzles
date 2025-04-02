import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001, // Matches your localhost:3001
    open: true,
    proxy: {
      '/rawg': {
        target: 'https://api.rawg.io/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/rawg/, '')
      }
    }
  },
  root: '.',
  build: {
    outDir: 'dist'
  }
});