import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import path from 'node:path';
import manifest from './manifest.config';

export default defineConfig({
  plugins: [react(), crx({ manifest })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // jsPDF's unused `.html()` plugin dynamically imports these — stub them out
      // so their code never ships in the packaged extension. See src/shims/empty-module.ts.
      html2canvas: path.resolve(__dirname, './src/shims/empty-module.ts'),
      dompurify: path.resolve(__dirname, './src/shims/empty-module.ts'),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
  },
});
