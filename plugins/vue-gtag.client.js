import VueGtag, { trackRouter } from 'vue-gtag-next'

export default defineNuxtPlugin((nuxtApp) => {
  const id = useRuntimeConfig().public.gtagId

  // No measurement ID configured (e.g. local dev) — skip loading GA entirely.
  if (!id) return

  nuxtApp.vueApp.use(VueGtag, {
    property: {
      id,
    },
  })

  // Track client-side route changes (SPA navigation) as page views.
  trackRouter(useRouter())
})
