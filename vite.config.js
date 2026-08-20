giimport { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'assets',
  server: {
    open: true,
    port: 5173
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
});
