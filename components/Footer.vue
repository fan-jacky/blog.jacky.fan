<script setup lang="ts">
import type { PayloadSiteSettings, SiteLink } from '~/types/payload'

const config = useRuntimeConfig()
const payloadUrl = config.payloadUrl || config.public.payloadUrl

const { data: settings } = await useAsyncData<PayloadSiteSettings>(
  'site-settings-footer',
  () => $fetch<PayloadSiteSettings>(`${payloadUrl}/api/globals/site_settings`),
)

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
          <NuxtLink
            v-if="link.linkType === 'internal'"
            :to="resolveHref(link)"
          >
            {{ link.label }}
          </NuxtLink>
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
