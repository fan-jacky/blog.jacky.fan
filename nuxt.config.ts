import { fileURLToPath } from "node:url";

const internalPayloadUrl =
    process.env.NUXT_PAYLOAD_URL ||
    process.env.NUXT_PUBLIC_PAYLOAD_URL ||
    process.env.PAYLOAD_PUBLIC_SERVER_URL ||
    process.env.PAYLOAD_URL ||
    'http://localhost:4101'

const publicPayloadUrl =
    process.env.NUXT_PUBLIC_PAYLOAD_URL ||
    process.env.PAYLOAD_PUBLIC_SERVER_URL ||
    internalPayloadUrl

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    workspaceDir: fileURLToPath(new URL(".", import.meta.url)),
    compatibilityDate: '2026-06-21',
    ignore: ["cms", "cms/**"],
    app: {
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
        payloadUrl: internalPayloadUrl,
        payloadApiKey: process.env.PAYLOAD_API_KEY || '',
        public: {
            payloadUrl: publicPayloadUrl,
        },
    },
    googleFonts: {
        families: {
            Inter: [400, 500, 600, 700, 800],
            'JetBrains Mono': [400, 500],
        },
    },
    nitro: {
        prerender: {
            routes: ["/sitemap.xml", "/rss.xml"],
        },
    },
    css: ['~/assets/css/global.scss'],
    ssr: true,
});
