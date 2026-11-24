import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://webrd01.is.autonavi.com https://webrd02.is.autonavi.com https://webrd03.is.autonavi.com https://webrd04.is.autonavi.com",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'self'",
].join('; ');

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'production-csp',
      apply: 'build',
      transformIndexHtml: () => [{
        tag: 'meta',
        attrs: { 'http-equiv': 'Content-Security-Policy', content: contentSecurityPolicy },
        injectTo: 'head-prepend',
      }],
    },
  ],
  server: {
    port: 5173,
  },
});
