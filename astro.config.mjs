import { defineConfig } from "astro/config";

export default defineConfig({
    vite: {
        server: {
            proxy: {
                "/forms.php": {
                    target: "http://localhost:8000",
                    changeOrigin: true,
                },
            },
        },
    },
});


/*

import { defineConfig } from "astro/config";

export default defineConfig({
    vite: {
        server: {
            proxy: {
                "/forms.php": {
                    target: "http://localhost:8000",
                    changeOrigin: true,
                },
            },
        },
    },
});

*/

/*
// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({});
*/