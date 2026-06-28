<script setup lang="ts">
import type { PayloadPost } from '~/types/payload'
import { useLivePreview } from '@payloadcms/live-preview-vue'

const route = useRoute()
const slug = route.params.slug as string
const config = useRuntimeConfig()

function normalizeOrigin(value: string | undefined) {
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
  if (import.meta.client) {
    const referrerOrigin = normalizeOrigin(document.referrer)

    if (referrerOrigin) {
      return referrerOrigin
    }
  }

  return normalizeOrigin(config.public.payloadUrl) || normalizeOrigin(config.payloadUrl)
}

const livePreviewServerURL = resolveLivePreviewServerURL()

const { data: fetchedPost, error } = await useFetch<PayloadPost>(
  `/api/payload-post/${encodeURIComponent(slug)}`
)

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode ?? 404,
    statusMessage: error.value.statusMessage ?? 'Post not found',
    fatal: true,
  })
}

const initialPost = fetchedPost.value as PayloadPost
const { data: post } = useLivePreview<PayloadPost>({
  initialData: initialPost,
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

useHead(() => ({
  title: post.value?.title ?? 'Preview',
  meta: [
    { name: 'robots', content: 'noindex,nofollow' },
    ...(post.value?.description
      ? [{ name: 'description', content: post.value.description }]
      : []),
  ],
}))

</script>

<template>
  <div class="site-wrapper">
    <NavBar />
    <main id="main-content" class="site-main">
      <section class="site-section site-section--article">
        <div class="geo-circle geo-circle--sm" style="top:8%;right:5%;" />
        <div class="container">
          <NuxtLink to="/articles" class="article-page__back-link">All articles</NuxtLink>
          <ArticleDocument v-if="post" :post="post" />
        </div>
      </section>
    </main>
    <PreviewBar />
    <Footer />
  </div>
</template>
