import path from 'path';

import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react';

import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({

  build: {

    lib: {

      entry: path.resolve(__dirname, 'src/lib/index.jsx'),

      name: 'Liveness interactivo versión Ciencia de datos',

      fileName: (format) => `npm-liveness_interactivo-main.${format}.js`

    },
    rollupOptions: {

      external: ['react', 'react-dom'],

      output: {

        globals: {

          react: 'React'

        }

      }

    }

  },

  plugins: [

    react(),
    cssInjectedByJsPlugin(),

  ],
  // publicDir: false,
  define: {
    // By default, Vite doesn't include shims for NodeJS/
    // necessary for segment analytics lib to work
    // global: {},
  },
})