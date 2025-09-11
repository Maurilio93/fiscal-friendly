import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "https://api.adoring-varahamihira.217-154-2-74.plesk.page",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
