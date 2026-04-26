import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';



export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // 👈 DOUBLE CHECK: Is your backend on 5000?
        changeOrigin: true,
        secure: false,
        ws: true
      },
    },
  },
});