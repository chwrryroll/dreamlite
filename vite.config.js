import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        scidia: resolve(__dirname, 'scidia.html'),
        cellorganelles: resolve(__dirname, 'cellorganelles.html'),
        error: resolve(__dirname, '404.html'),
      },
    },
  },
});