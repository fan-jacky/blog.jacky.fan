<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { PayloadSiteSettings, SiteLink } from '@/types/payload'

const payloadUrl = import.meta.env.PUBLIC_PAYLOAD_URL || ''

const settings = ref<PayloadSiteSettings | null>(null)

onMounted(async () => {
  // The island is client-only, so footer settings are fetched from the CMS on
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
    // Keep fallback content when the CMS is unreachable.
  }
})

const copyright = computed(() =>
  settings.value?.footerCopyright || '© 2023–2026 Jacky FAN — Hong Kong',
)

const footerLinks = computed<SiteLink[]>(() =>
  settings.value?.footerLinks?.length
    ? settings.value.footerLinks
    : [
        { label: 'GitHub', linkType: 'external', externalUrl: 'https://github.com/redfrogsss' },
        { label: 'Blog', linkType: 'external', externalUrl: 'https://blog.jacky.fan' },
        { label: 'Sitemap', linkType: 'internal', internalPath: '/sitemap.xml' },
      ],
)

function resolveHref(link: SiteLink): string {
  return link.linkType === 'external' ? (link.externalUrl ?? '#') : (link.internalPath ?? '/')
}
</script>

<template>
  <footer class="site-footer">
    <div class="container site-footer__inner">
      <span class="site-footer__info">{{ copyright }}</span>
      <div class="site-footer__links">
        <template v-for="link in footerLinks" :key="link.id ?? link.label">
          <a
            v-if="link.linkType === 'internal'"
            :href="resolveHref(link)"
          >
            {{ link.label }}
          </a>
          <a
            v-else
            :href="resolveHref(link)"
            target="_blank"
            rel="noopener"
          >
            {{ link.label }}
          </a>
        </template>
      </div>
    </div>
  </footer>
</template>
