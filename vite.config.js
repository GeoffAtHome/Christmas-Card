import { resolve } from "path";
import { defineConfig } from "vite";
// vite.config.js
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
    plugins: [
        VitePWA({
            strategies: "injectManifest",
            srcDir: "src",
            filename: "custom-sw.ts",
            injectManifest: {
                swSrc: "src/custom-sw.ts",
                swDest: "dist/custom-sw.js",
            },
            manifest: false,
            registerType: "autoUpdate",
        }),
    ],
    publicDir: "../assets",
    // ...existing config...
    server: {
        port: 5173,
    },
});
