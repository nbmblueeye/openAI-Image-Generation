import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig( ({mode}) => {
    let ENV = "production";
    return {
      plugins: [react()],
      server: {
        port:3000,
        proxy: {
          '/api': {
            target: ENV === "production" ? 'https://openai-image-generation-20i3.onrender.com':'http://localhost:5000',
            changeOrigin: true,
          },
        }
      }
    }

})
