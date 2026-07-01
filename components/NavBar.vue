<script setup lang="ts">
const route = useRoute()

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const mounted = ref(false)
let keydownHandler: ((event: KeyboardEvent) => void) | null = null

const links = [
    { label: 'Writing', to: '/' },
    { label: 'All Articles', to: '/articles' },
    { label: 'About', to: '/about' },
]

function isActiveLink(target: string) {
    if (target === '/') {
        return route.path === '/'
    }

    return route.path === target || route.path.startsWith(`${target}/`)
}

function syncScrolledState() {
    if (import.meta.client) {
        isScrolled.value = window.scrollY > 10
    }
}

function toggleTheme() {
    if (!import.meta.client) {
        return
    }

    const html = document.documentElement
    const isDark = html.getAttribute('data-theme') === 'dark'

    if (isDark) {
        html.removeAttribute('data-theme')
        localStorage.setItem('theme', 'light')
    } else {
        html.setAttribute('data-theme', 'dark')
        localStorage.setItem('theme', 'dark')
    }
}

function openMobileMenu() {
    isMobileMenuOpen.value = true
    document.body.style.overflow = 'hidden'
}

function closeMobileMenu() {
    isMobileMenuOpen.value = false
    document.body.style.overflow = ''
}

onMounted(() => {
    mounted.value = true

    const storedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark')
    }

    syncScrolledState()
    window.addEventListener('scroll', syncScrolledState, { passive: true })

    keydownHandler = (event: KeyboardEvent) => {
        if (event.ctrlKey && event.shiftKey && event.key === 'D') {
            event.preventDefault()
            toggleTheme()
        }
    }

    document.addEventListener('keydown', keydownHandler)
})

onBeforeUnmount(() => {
    if (import.meta.client) {
        window.removeEventListener('scroll', syncScrolledState)

        if (keydownHandler) {
            document.removeEventListener('keydown', keydownHandler)
        }

        document.body.style.overflow = ''
    }
})

// Watch route changes to close mobile menu
watch(() => route.fullPath, () => {
    closeMobileMenu()
})
</script>

<template>
    <header :class="['site-header', { 'is-scrolled': isScrolled }]">
        <div class="container site-header__inner">
            <NuxtLink to="/" class="site-logo" aria-label="Jacky FAN home">
                <span class="site-logo__dot" />Jacky FAN
            </NuxtLink>
            <nav class="site-nav" aria-label="Primary">
                <div class="site-nav__links">
                    <NuxtLink
                        v-for="link in links"
                        :key="link.to"
                        :to="link.to"
                        :class="['site-nav__link', { 'site-nav__link--active': isActiveLink(link.to) }]"
                        :aria-current="isActiveLink(link.to) ? 'page' : undefined"
                    >
                        {{ link.label }}
                    </NuxtLink>
                </div>
                <button
                    type="button"
                    class="theme-toggle"
                    aria-label="Toggle dark mode"
                    title="Toggle dark mode (Ctrl+Shift+D)"
                    @click="toggleTheme"
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
                <NuxtLink
                    v-for="(link, index) in links"
                    :key="link.to"
                    :to="link.to"
                    :class="['mobile-nav-overlay__link', { 'mobile-nav-overlay__link--active': isActiveLink(link.to) }]"
                    :style="{ animationDelay: `${0.1 + index * 0.08}s` }"
                    :aria-current="isActiveLink(link.to) ? 'page' : undefined"
                >
                    {{ link.label }}
                </NuxtLink>
            </nav>
        </div>
    </Teleport>
</template>
