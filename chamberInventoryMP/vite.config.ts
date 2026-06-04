import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  /*css: {
    preprocessorOptions: {
      scss: {
        // Esto inyecta automáticamente el archivo en cada módulo .scss de la app
        additionalData: `@use "./src/styles/variables" as *;`,
      },
    },
  },*/
  server: {
    port: 5175,
    strictPort: true,
  },
});
