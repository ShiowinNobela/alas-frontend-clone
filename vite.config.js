import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import flowbiteReact from 'flowbite-react/plugin/vite';
import viteCompression from 'vite-plugin-compression';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  const plugins = [react(), tailwindcss(), flowbiteReact()];

  if (isProduction) {
    plugins.push(
      viteCompression({ algorithm: 'brotliCompress', threshold: 1024 }),
      viteCompression({ algorithm: 'gzip' })
    );
  }

  return {
    plugins,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: 'https://alas-backend-clone-q4bv.onrender.com',
          changeOrigin: true,
          secure: false,
          ws: true,
        },
        '/socket.io/': {
          target: 'https://alas-backend-clone-q4bv.onrender.com',
          changeOrigin: true,
          secure: false,
          ws: true,
        },
      },
      historyApiFallback: true,
    },
    build: {
      assetsInclude: ['**/*.ttf', '**/*.woff', '**/*.woff2'],
      outDir: 'dist',
    },
    base: '/',
  };
});
