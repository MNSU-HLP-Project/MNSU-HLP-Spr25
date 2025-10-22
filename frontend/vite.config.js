import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { qrcode } from 'vite-plugin-qrcode';

export default defineConfig(({ mode }) => ({
  plugins: [react(), qrcode()],
  server: {
    host: true,
    port: 5173,
    // 👇 Add this to make local API calls work in dev mode (Docker or local)
    proxy: {
      '/api': {
        target: 'http://backend:8000',
        changeOrigin: true,
      },
      '/user_auth': {
        target: 'http://backend:8000',
        changeOrigin: true,
      },
    },
  },
  css: {
    postcss: './postcss.config.js',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
}));