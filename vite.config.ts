import { defineConfig } from "vite";
import { resolve } from "path";
import fullReload from "vite-plugin-full-reload";
import postcssConfig from "./postcss.config.js";

export default defineConfig({
  root: "static/src",
  base: "/theme_kdmobilier/static/",
  build: {
    outDir: resolve(__dirname, "static/build"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "static/src/js/main.js"),
        styles: resolve(__dirname, "static/src/css/input.css"),
      },
      output: {
        entryFileNames: "js/[name].js",
        assetFileNames: "css/[name][extname]",
      },
      external: [/^@web\//, /^@odoo\//, "owl.carousel", "jquery"],
    },
  },
  plugins: [
    fullReload(["../../**/*.xml", "../../**/*.py"], { delay: 300 }),
    // fullReload(['../../**/*.py'], { delay: 300 }),
  ],
  server: {
    port: 3000,
    strictPort: true,
    hmr: {
      protocol: "ws",
      host: "localhost",
    },
    cors: true,
    origin: "http://localhost:3000",
  },
  css: {
    postcss: postcssConfig,
    devSourcemap: true,
  },
  optimizeDeps: {
    include: ["jquery"],
  },
});
