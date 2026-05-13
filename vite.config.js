import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        servicos: resolve(__dirname, 'servicos.html'),
        equipe: resolve(__dirname, 'equipe.html'),
        contato: resolve(__dirname, 'contato.html'),
        agendamento: resolve(__dirname, 'agendamento.html')
      }
    }
  }
})
