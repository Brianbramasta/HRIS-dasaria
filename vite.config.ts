import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        // This will transform your SVG to a React component
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    watch: {
      // Ignore changes to db.json and server.js to prevent dev reloads
      // when json-server writes updates after PATCH/POST.
      ignored: [
        path.resolve(__dirname, './db.json'),
        path.resolve(__dirname, './server.js'),
      ],
    },
  },
});
