<script setup lang="ts">
const route = useRoute()

let revealObserver: IntersectionObserver | null = null

function disconnectRevealObserver() {
  revealObserver?.disconnect()
  revealObserver = null
}

function activateRevealAnimations() {
  if (!import.meta.client) {
    return
  }

  disconnectRevealObserver()

  const targets = Array.from(document.querySelectorAll<HTMLElement>('.reveal, .reveal-stagger'))

  if (!targets.length) {
    return
  }

  if (!('IntersectionObserver' in window)) {
    for (const element of targets) {
      element.classList.add('is-visible')
    }

    return
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          revealObserver?.unobserve(entry.target)
        }
      }
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px',
    },
  )

  for (const element of targets) {
    revealObserver.observe(element)
  }
}

onMounted(async () => {
  await nextTick()
  activateRevealAnimations()
})

watch(
  () => route.fullPath,
  async () => {
    await nextTick()
    activateRevealAnimations()
  },
)

onBeforeUnmount(() => {
  disconnectRevealObserver()
})
</script>

<template>
  <div class="site-shell">
    <a href="#main-content" class="skip-link">Skip to content</a>
    <NuxtPage />
  </div>
</template>