import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    open: '/index.html',
  },
  base: '/',
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        mapa: resolve(__dirname, 'mapa.html'),
        admin: resolve(__dirname, 'admin.html'),
        buscador_por_aula: resolve(__dirname, 'buscador_por_aula.html'),
        buscardo_por_materia: resolve(__dirname, 'buscardo_por_materia.html'),
      }
    }
  }
});