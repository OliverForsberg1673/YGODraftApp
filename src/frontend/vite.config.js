import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  root: "./frontend",
  server: {
    middlewareMode: true,
    hmr: {
      protocol: "ws",
      host: "localhost",
      port: 3000,
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./frontend"),
    },
  },
  build: {
    outDir: "../dist/frontend",
    emptyOutDir: true,
  },
});
