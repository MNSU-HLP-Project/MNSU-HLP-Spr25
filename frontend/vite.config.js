import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { qrcode } from 'vite-plugin-qrcode';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),qrcode()],
  server: {
    host: true,  // Allows LAN access
    port: 5173,  // Default port
  },
  css: {
    postcss: './postcss.config.js',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // This maps "@/lib/utils" to "src/lib/utils"
    },
  },
});
