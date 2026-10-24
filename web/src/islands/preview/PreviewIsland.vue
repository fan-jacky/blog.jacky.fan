<script setup lang="ts">
import type { PayloadPost } from '@/types/payload'
import { useLivePreview } from '@payloadcms/live-preview-vue'
import Document from './Document.vue'
import Footer from './Footer.vue'
import NavBar from './NavBar.vue'
import PreviewBar from './PreviewBar.vue'

const props = defineProps<{
  post: PayloadPost
  publicPayloadUrl?: string
}>()

function normalizeOrigin(value: string | undefined | null) {
  if (!value) {
    return ''
  }

  try {
    return new URL(value).origin
  } catch {
    return ''
  }
}

function resolveLivePreviewServerURL() {
  // The preview page is rendered inside the CMS admin panel's iframe, so the
  // referrer origin identifies the CMS instance the editor is working in.
  const referrerOrigin = normalizeOrigin(document.referrer)

  if (referrerOrigin) {
    return referrerOrigin
  }

  return normalizeOrigin(props.publicPayloadUrl)
}

const livePreviewServerURL = resolveLivePreviewServerURL()

const { data: post } = useLivePreview<PayloadPost>({
  initialData: props.post,
  serverURL: livePreviewServerURL,
  requestHandler: ({ data, endpoint }) => {
    return fetch(`/api/payload-live-preview/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  },
  depth: 1,
})
</script>

<template>
  <div class="site-wrapper">
    <NavBar />
    <main id="main-content" class="site-main">
      <section class="site-section site-section--article">
        <div class="geo-circle geo-circle--sm" style="top:8%;right:5%;" />
        <div class="container">
          <a href="/articles" class="article-page__back-link">All articles</a>
          <Document v-if="post" :post="post" />
        </div>
      </section>
    </main>
    <PreviewBar />
    <Footer />
  </div>
</template>
