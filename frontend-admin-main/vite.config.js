import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    
    proxy: {
      '/api': {
        // 🔴 반드시 'backend'를 'localhost'로 수정해야 합니다.
        target: 'http://localhost:4000', 
        changeOrigin: true,
        secure: false,
      },
    },

    watch: {
      usePolling: true, 
    },
  },
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        sourceMap: true,
        sourceMapContents: true,
      },
    },
  },
});