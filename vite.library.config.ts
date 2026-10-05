import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  publicDir: false,
  plugins: [react()],
  build: {
    outDir: "dist/lib",
    lib: {
      entry: "src/index.ts",
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
    },
    rollupOptions: {
      external: (id) => /^(react|react-dom|@base-ui\/react)(\/|$)/.test(id),
      output: { banner: '"use client";' },
    },
  },
});
