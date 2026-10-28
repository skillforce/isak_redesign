import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://gera2.by",
  output: "static",
  server: {
    host: true,
    allowedHosts: true,
  },
});
