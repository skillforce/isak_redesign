import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://gera2.by",
  output: "static",
  build: {
    // Inline all CSS: saves a render-blocking round trip on slow networks.
    inlineStylesheets: "always",
  },
  server: {
    host: true,
    allowedHosts: true,
  },
});
