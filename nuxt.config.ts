import { fileURLToPath } from "node:url";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    workspaceDir: fileURLToPath(new URL(".", import.meta.url)),
    ignore: ["cms", "cms/**"],
    app: {
        pageTransition: { name: "page", mode: "out-in" },
        head: {
            htmlAttrs: {
                lang: "en",
            },
        },
    },
    modules: [
        "@nuxt/content",
        "@nuxtjs/tailwindcss",
        "@vueuse/nuxt",
        "@nuxtjs/google-fonts",
    ],
    content: {
        documentDriven: true,
        highlight: {
            theme: "one-dark-pro",
        },
    },
    appConfig: {
        public: {
            NUXT_PUBLIC_GTAG_ID: process.env.NUXT_PUBLIC_GTAG_ID,
        },
    },
    runtimeConfig: {
        // Server-only secrets
        previewSecret: process.env.PREVIEW_SECRET || '',
        payloadUrl: process.env.NUXT_PAYLOAD_URL || process.env.PAYLOAD_URL || 'http://localhost:3001',
        payloadApiKey: process.env.PAYLOAD_API_KEY || '',
        public: {
            payloadUrl: process.env.NUXT_PAYLOAD_URL || process.env.PAYLOAD_URL || 'http://localhost:3001',
        },
    },
    googleFonts: {
        families: {
            Roboto: true,
            Dosis: true,
            Outfit: true,
        },
    },
    nitro: {
        prerender: {
            routes: ["/sitemap.xml", "/rss.xml"],
        },
    },
    css: ['~/assets/css/global.css']
});
