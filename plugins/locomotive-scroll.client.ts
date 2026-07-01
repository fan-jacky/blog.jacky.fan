import LocomotiveScroll from 'locomotive-scroll'
import 'locomotive-scroll/dist/locomotive-scroll.css'

export default defineNuxtPlugin((nuxtApp) => {
  // Only run on client
  if (!import.meta.client) return

  let locomotiveScroll: LocomotiveScroll | null = null

  nuxtApp.hook('app:mounted', () => {
    locomotiveScroll = new LocomotiveScroll({
      el: document.querySelector('[data-scroll-container]') as HTMLElement | undefined,
      smooth: true,
      lerp: 0.08,
    })

    // Provide the instance to the app
    nuxtApp.provide('locomotiveScroll', locomotiveScroll)
  })

  nuxtApp.hook('app:beforeUnmount', () => {
    locomotiveScroll?.destroy()
  })
})
