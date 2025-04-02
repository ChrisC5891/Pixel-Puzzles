import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  root: '.', // Set root to current directory
  build: {
    outDir: 'dist' // Keep build output separate
  }
});