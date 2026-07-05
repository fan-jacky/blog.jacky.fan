import { fileURLToPath } from "node:url";

const internalPayloadUrl =
    process.env.NUXT_PAYLOAD_URL ||
    process.env.NUXT_PUBLIC_PAYLOAD_URL ||
    process.env.PAYLOAD_PUBLIC_SERVER_URL ||
    process.env.PAYLOAD_URL ||
    'http://localhost:4101'

// Use ?? for NUXT_PUBLIC_PAYLOAD_URL so empty string (proxy mode) is preserved.
// In proxy mode, client-side CMS calls go to same-origin /api/* and the Nuxt
// server proxies to the internal CMS (cms:4201).  When unset (dev), falls
// through to the internal URL as before.
const publicPayloadUrl =
    process.env.NUXT_PUBLIC_PAYLOAD_URL ??
    process.env.PAYLOAD_PUBLIC_SERVER_URL ??
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
            meta: [
                { property: 'og:image', content: 'http://rpi5-1:4201/api/media/file/blogjackyfan-og-v4.png' },
                { property: 'og:image:width', content: '1200' },
                { property: 'og:image:height', content: '630' },
                { name: 'twitter:card', content: 'summary_large_image' },
                { name: 'twitter:image', content: 'http://rpi5-1:4201/api/media/file/blogjackyfan-og-v4.png' },
            ],
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
