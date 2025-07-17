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
        buscador_por_aula: resolve(__dirname, 'buscador_por_aula.html'),
        buscador_por_materia: resolve(__dirname, 'buscador_por_materia.html'),
      }
    }
  }
});
