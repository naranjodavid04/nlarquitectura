// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  // Cambia esto por tu dominio definitivo cuando despliegues (ej. https://danielnaranjo.com)
  site: "https://danielnaranjo.com",
  i18n: {
    defaultLocale: "es",
    locales: ["es", "en"],
    routing: {
      prefixDefaultLocale: false, // español en "/", inglés en "/en/"
    },
  },
  build: {
    inlineStylesheets: "auto",
  },
});
