import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test-setup.ts"],
    include: ["**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      // Cobertura unitária foca na lógica da aplicação (serviços, componentes,
      // contexto/hooks). As rotas do App Router (src/app/**) são validadas por
      // E2E (Playwright), não por teste unitário.
      include: ["src/services/**", "src/components/**", "src/context/**", "src/hooks/**"],
      exclude: ["**/*.test.{ts,tsx}", "**/*.d.ts"],
      thresholds: {
        lines: 70,
        branches: 70,
      },
    },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
