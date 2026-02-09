import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// ブラウザプレビュー専用のVite設定
export default defineConfig({
  plugins: [react()],
  root: 'src/renderer',
  publicDir: path.resolve(__dirname, 'public'),
  build: {
    outDir: path.resolve(__dirname, 'dist-browser'),
    emptyOutDir: true,
    assetsDir: 'assets',
    copyPublicDir: true
  },
  server: {
    port: 5173,
    host: true
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "${path.resolve(__dirname, 'src/renderer/shared/styles/variables.scss')}";
          @import "${path.resolve(__dirname, 'src/renderer/shared/styles/mixins.scss')}";
        `
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/renderer'),
      '@shared': path.resolve(__dirname, 'src/renderer/shared')
    }
  }
});
