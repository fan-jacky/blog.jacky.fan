// @ts-check
import { defineConfig } from 'astro/config'
import node from '@astrojs/node'
import vue from '@astrojs/vue'

// Hybrid output: every page is prerendered to static HTML at build time,
// except pages/endpoints that opt out with `export const prerender = false`
// (the CMS live-preview route and its API endpoints).
export default defineConfig({
    site: 'https://blog.jacky.fan',
    output: 'static',
    adapter: node({ mode: 'standalone' }),
    integrations: [vue()],
    server: {
        port: 4100,
    },
})
