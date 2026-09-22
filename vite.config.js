import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// See .env.example — VITE_API_URL lets you point at a non-default backend.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
