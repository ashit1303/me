import { defineConfig } from 'vite';

export default defineConfig({
  base: '/me/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
});

