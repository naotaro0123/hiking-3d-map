import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/hiking-3d-map", // リポジトリ名
  plugins: [react()],
});
