import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), TanStackRouterVite()],
  server: {
    proxy: {
      '/api': 'http://localhost:8090',
      '/custom_api': 'http://localhost:8090',
    },
  },
  resolve: {
    alias: {
      '@/': '/src/',
    },
  },
});
