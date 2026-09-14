import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "assets/index-0gp-ggxE.js",
        chunkFileNames: "assets/chunk-[name].js",
        assetFileNames: asset => asset.names?.some(name => name.endsWith(".css")) ? "assets/index-BqEKqRLk.css" : "assets/[name][extname]",
      },
    },
  },
});
