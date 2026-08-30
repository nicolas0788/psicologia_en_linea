// @ts-check

import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://psicologiaenlinea.com.ar",

  integrations: [
    sitemap({
      filter: (page) =>
        ![
          "https://psicologiaenlinea.com.ar/condiciones-profesionales/",
          "https://psicologiaenlinea.com.ar/gracias-prof/",
          "https://psicologiaenlinea.com.ar/gracias/",
          "https://psicologiaenlinea.com.ar/politica-de-privacidad/",
          "https://psicologiaenlinea.com.ar/profesionales-form/",
        ].includes(page),
    }),
  ],
});