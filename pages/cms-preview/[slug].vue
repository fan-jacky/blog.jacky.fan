<script setup lang="ts">
import type { SlateNode, SlateLeaf } from '~/types/slate'
import type { PayloadPost } from '~/types/payload'
import { useLivePreview } from '@payloadcms/live-preview-vue'
import SlateRenderer from '~/components/content/SlateRenderer.vue'

function extractTextFromSlate(nodes: Array<SlateNode | SlateLeaf> = []): string {
  return nodes
    .map((node) => {
      if ('text' in node && typeof node.text === 'string') return node.text
      if ('children' in node && Array.isArray(node.children)) {
        return extractTextFromSlate(node.children)
      }
      return ''
    })
    .join(' ')
}

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

const formattedDate = computed(() => {
  const d = post.value?.publishedDate
  return d ? new Date(d).toDateString() : ''
})

const estimatedReadTime = computed(() => {
  if (!post.value?.content) return 0
  const text = extractTextFromSlate(post.value.content)
  const wordCount = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(wordCount / 250))
})

const contentNodes = computed(() => post.value?.content ?? [])
const hasContent = computed(() => contentNodes.value.length > 0)
</script>

<template>
  <div class="bg-base-300 min-h-screen h-full">
    <NavBar />
    <main
      class="max-w-[1280px] px-4 md:px-6 lg:px-8 mx-auto py-8 min-h-screen"
    >
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div class="col-span-3">
          <div
            v-if="post"
            class="bg-base-100 rounded-3xl shadow-md my-4 px-4 md:px-8 py-12"
          >
            <!-- Breadcrumbs -->
            <div class="breadcrumbs mb-2">
              <ul class="text-sm">
                <li class="prose text-sm">
                  <NuxtLink to="/" class="no-underline hover:text-blue-500">
                    Home
                  </NuxtLink>
                </li>
                <li class="prose text-sm">{{ post.title }}</li>
              </ul>
            </div>

            <!-- Draft badge -->
            <div
              v-if="post.status === 'draft'"
              class="mb-4 inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800"
            >
              Draft
            </div>

            <article class="prose prose-slate w-full">
              <h1>{{ post.title }}</h1>
              <hr class="m-0 mb-2" />
              <small>
                <IconsDateIcon
                  v-if="formattedDate"
                  className="w-auto h-[1.2em] mb-1 mr-1 inline"
                />{{ formattedDate }}
                <template v-if="post.author">
                  &nbsp;|&nbsp;
                  <IconsPersonIcon className="w-auto h-[1.2em] mb-1 mr-1 inline" />{{
                    post.author
                  }}
                </template>
                &nbsp;|&nbsp;
                <IconsClock className="w-auto h-[1.2em] mb-1 mr-1 inline" />{{
                  estimatedReadTime
                }}
                min read
              </small>

              <!-- Rich text content rendered from Payload Slate JSON -->
              <SlateRenderer
                v-if="hasContent"
                :nodes="contentNodes"
              />
              <p v-else class="text-base-content/50 italic">
                No content yet.
              </p>
            </article>
          </div>
        </div>

        <div>
          <AuthorPanel />
          <LatestPostPanel />
        </div>
      </div>
    </main>

    <!-- Preview bar is always shown on this page -->
    <PreviewBar />
    <Footer />
  </div>
</template>
