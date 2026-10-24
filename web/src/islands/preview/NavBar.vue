<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { PayloadSiteSettings, SiteLink } from '@/types/payload'

const payloadUrl = import.meta.env.PUBLIC_PAYLOAD_URL || ''

const activePath = ref('/')
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const mounted = ref(false)
const settings = ref<PayloadSiteSettings | null>(null)

// Fallback links if CMS hasn't been configured yet
const defaultLinks: SiteLink[] = [
  { label: 'Writing', linkType: 'internal', internalPath: '/' },
  { label: 'All Articles', linkType: 'internal', internalPath: '/articles' },
  { label: 'About', linkType: 'internal', internalPath: '/about' },
]

const links = computed<SiteLink[]>(() => settings.value?.navLinks?.length
  ? settings.value.navLinks
  : defaultLinks,
)

function resolveLinkHref(link: SiteLink): string {
  if (link.linkType === 'external') {
    return link.externalUrl ?? '#'
  }
  return link.internalPath ?? '/'
}

function isActiveLink(link: SiteLink): boolean {
  if (link.linkType === 'external') {
    return false
  }
  const target = link.internalPath ?? '/'
  if (target === '/') {
    return activePath.value === '/'
  }
  return activePath.value === target || activePath.value.startsWith(`${target}/`)
}

function syncScrolledState() {
  isScrolled.value = window.scrollY > 10
}

function openMobileMenu() {
  isMobileMenuOpen.value = true
  document.body.style.overflow = 'hidden'
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
  document.body.style.overflow = ''
}

onMounted(async () => {
  mounted.value = true
  activePath.value = window.location.pathname

  // Theme init + toggling are owned by the Base layout (bootstrap script and
  // delegated .theme-toggle / Ctrl+Shift+D handlers), so the island only
  // tracks scroll state and the mobile menu here.

  syncScrolledState()
  window.addEventListener('scroll', syncScrolledState, { passive: true })

  // The island is client-only, so site settings are fetched from the CMS on
  // mount. Skipped in same-origin proxy mode (no public CMS URL configured) —
  // the fallback links apply, matching the Nuxt behavior when the client
  // fetch fails.
  if (!payloadUrl) {
    return
  }

  try {
    const response = await fetch(`${payloadUrl}/api/globals/site_settings`)
    if (response.ok) {
      settings.value = (await response.json()) as PayloadSiteSettings
    }
  } catch {
    // Keep fallback links when the CMS is unreachable.
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', syncScrolledState)
  document.body.style.overflow = ''
})
</script>

<template>
  <header :class="['site-header', { 'is-scrolled': isScrolled }]">
    <div class="container site-header__inner">
      <a href="/" class="site-logo" aria-label="Jacky FAN home">
        <span class="site-logo__dot" />Jacky FAN's Blog
      </a>
      <nav class="site-nav" aria-label="Primary">
        <div class="site-nav__links">
          <template v-for="link in links" :key="link.id ?? link.label">
            <a
              v-if="link.linkType === 'internal'"
              :href="resolveLinkHref(link)"
              :class="['site-nav__link', { 'site-nav__link--active': isActiveLink(link) }]"
              :aria-current="isActiveLink(link) ? 'page' : undefined"
            >
              {{ link.label }}
            </a>
            <a
              v-else
              :href="resolveLinkHref(link)"
              class="site-nav__link"
              target="_blank"
              rel="noopener"
            >
              {{ link.label }}
            </a>
          </template>
        </div>
        <button
          type="button"
          class="theme-toggle"
          aria-label="Toggle dark mode"
          title="Toggle dark mode (Ctrl+Shift+D)"
        >
          <svg class="theme-toggle__icon--sun" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="3" fill="currentColor" />
            <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M2.929 2.929l1.06 1.06m8.486 8.486l1.06 1.06M2.929 13.071l1.06-1.06m8.486-8.486l1.06-1.06" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
          </svg>
          <svg class="theme-toggle__icon--moon" viewBox="0 0 16 16" fill="none">
            <path d="M13.5 10.5a6 6 0 01-7.5-7.5A6 6 0 1013.5 10.5z" fill="currentColor" />
          </svg>
        </button>
        <button
          type="button"
          :class="['mobile-nav-toggle', { 'mobile-nav-toggle--open': isMobileMenuOpen }]"
          :aria-expanded="isMobileMenuOpen"
          aria-controls="mobile-nav-overlay"
          aria-label="Toggle navigation menu"
          @click="isMobileMenuOpen ? closeMobileMenu() : openMobileMenu()"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>
    </div>
  </header>

  <Teleport v-if="mounted" to="body">
    <div
      :class="['mobile-nav-overlay', { 'mobile-nav-overlay--open': isMobileMenuOpen }]"
      id="mobile-nav-overlay"
      :aria-hidden="!isMobileMenuOpen"
    >
      <button
        class="mobile-nav-overlay__close"
        type="button"
        aria-label="Close navigation menu"
        @click="closeMobileMenu"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      <nav class="mobile-nav-overlay__nav" aria-label="Mobile navigation">
        <template v-for="(link, index) in links" :key="link.id ?? link.label">
          <a
            v-if="link.linkType === 'internal'"
            :href="resolveLinkHref(link)"
            :class="['mobile-nav-overlay__link', { 'mobile-nav-overlay__link--active': isActiveLink(link) }]"
            :style="{ animationDelay: `${0.1 + index * 0.08}s` }"
            :aria-current="isActiveLink(link) ? 'page' : undefined"
          >
            {{ link.label }}
          </a>
          <a
            v-else
            :href="resolveLinkHref(link)"
            class="mobile-nav-overlay__link"
            :style="{ animationDelay: `${0.1 + index * 0.08}s` }"
            target="_blank"
            rel="noopener"
          >
            {{ link.label }}
          </a>
        </template>
      </nav>
    </div>
  </Teleport>
</template>
