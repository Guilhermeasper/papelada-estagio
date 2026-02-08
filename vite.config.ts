import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  base: process.env.GITHUB_REPOSITORY
    ? `/${process.env.GITHUB_REPOSITORY.split("/")[1]}/`
    : "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@papelada-estagio": resolve(__dirname, "./src"),
    },
  },
});
