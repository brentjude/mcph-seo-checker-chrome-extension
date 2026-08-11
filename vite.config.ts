import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import path from 'node:path';
import manifest from './manifest.config';

/**
 * jsPDF's `output()` method has a "pdfobjectnewwindow" mode that builds a
 * `<script src="https://cdnjs.cloudflare.com/...">` string to load PDFObject
 * from a CDN. It's baked into the same module as `.save()` (not tree-shakeable),
 * and Chrome Web Store's reviewer flags that literal as "remotely hosted code"
 * even though we never call that output mode (we only use `.save()`). Strip the
 * dead case block at build time so the URL never ships in the package.
 */
function stripJsPdfRemoteCode(): Plugin {
  const marker = 'cdnjs.cloudflare.com';
  const pattern = /case "pdfobjectnewwindow":[\s\S]*?(?=case "dataurlnewwindow":)/;
  const replacement =
    'case "pdfobjectnewwindow":\n' +
    '      case "pdfjsnewwindow":\n' +
    '        throw new Error("This jsPDF output type is disabled in this build.");\n\n      ';

  return {
    name: 'strip-jspdf-remote-code',
    enforce: 'pre',
    transform(code, id) {
      if (!id.replace(/\\/g, '/').includes('node_modules/jspdf/') || !code.includes(marker)) {
        return null;
      }
      const stripped = code.replace(pattern, replacement);
      if (stripped === code || stripped.includes(marker)) {
        this.warn(
          'strip-jspdf-remote-code: expected pattern not found/removed in jsPDF source — a remote URL may still ship in the build. jsPDF version may have changed; re-check node_modules/jspdf/dist/jspdf.es.js.'
        );
      }
      return { code: stripped, map: null };
    },
  };
}

export default defineConfig({
  plugins: [stripJsPdfRemoteCode(), react(), crx({ manifest })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // jsPDF's unused `.html()` plugin dynamically imports these — stub them out
      // so their code never ships in the packaged extension. See src/shims/empty-module.ts.
      html2canvas: path.resolve(__dirname, './src/shims/empty-module.ts'),
      dompurify: path.resolve(__dirname, './src/shims/empty-module.ts'),
      // jsPDF's package.json "module" field points at the pre-minified jspdf.es.min.js,
      // which stripJsPdfRemoteCode() can't pattern-match. Use the unminified source so
      // the transform can find and strip the remote-code branch; Vite re-minifies it anyway.
      jspdf: path.resolve(__dirname, './node_modules/jspdf/dist/jspdf.es.js'),
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
