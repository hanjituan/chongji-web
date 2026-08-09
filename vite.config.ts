import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      // 代理所有 /api 开头的请求到后端
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        // 如果后端接口不需要 /api 前缀，可以使用 rewrite
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
