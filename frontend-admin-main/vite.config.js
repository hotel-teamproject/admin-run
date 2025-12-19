import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    
    // ▼▼▼ [추가할 부분 시작] ▼▼▼
    // '/api'로 시작하는 요청이 오면 5000번 포트(백엔드)로 토스합니다.
    proxy: {
      '/api': {
        target: 'http://localhost:4000', // 백엔드 주소 (여기가 핵심!)
        changeOrigin: true,
        secure: false,
      },
    },
    // ▲▲▲ [추가할 부분 끝] ▲▲▲

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