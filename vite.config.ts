/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  // En GitHub Pages el sitio vive en /Kiosc-page/ (solo cambia el build).
  base: process.env.GITHUB_PAGES ? "/Kiosc-page/" : "/",
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom",
    globals: true,
    css: true,
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: ["src/test/**", "src/main.tsx", "**/*.d.ts"],
    },
  },
});
