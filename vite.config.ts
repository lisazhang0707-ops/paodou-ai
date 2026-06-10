import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: "/paodou-ai/",
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api/tavily": {
        target: "https://api.tavily.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/tavily/, ""),
      },
    },
  },
})
