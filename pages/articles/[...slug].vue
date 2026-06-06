<script setup lang="ts">
import type { PayloadPost, PayloadPostSummary } from '~/types/payload'
import { extractContentBlocksTableOfContents, normalizePayloadSlug } from '~/utils/payloadPost'

const route = useRoute()
const slug = normalizePayloadSlug(route.params.slug as string | string[] | undefined)

if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Missing slug parameter', fatal: true })
}

const [{ data: post, error }, { data: posts }] = await Promise.all([
    useFetch<PayloadPost>(`/api/payload-post/${encodeURIComponent(slug)}`, {
        key: `payload-post-${slug}`,
    }),
    useFetch<PayloadPostSummary[]>('/api/payload-posts', {
        key: 'payload-posts',
    }),
])

if (error.value) {
    throw createError({
        statusCode: error.value.statusCode ?? 404,
        statusMessage: error.value.statusMessage ?? 'Post not found',
        fatal: true,
    })
}

const previewCookie = useCookie('payload-preview')

const tocLinks = computed(() => extractContentBlocksTableOfContents(post.value?.content ?? []))

const currentPostIndex = computed(() =>
    (posts.value ?? []).findIndex(({ slug: entrySlug }) => entrySlug === post.value?.slug)
)

const prevPost = computed(() => {
    const index = currentPostIndex.value
    const entries = posts.value ?? []
    return index >= 0 && index + 1 < entries.length ? entries[index + 1] : null
})

const nextPost = computed(() => {
    const index = currentPostIndex.value
    const entries = posts.value ?? []
    return index > 0 ? entries[index - 1] : null
})

useHead(() => ({
    title: post.value?.title ?? 'Article',
    meta: post.value?.description
        ? [{ name: 'description', content: post.value.description }]
        : [],
}))
</script>

<template>
    <div class="bg-base-300 min-h-screen h-full">
        <NavBar />
        <main class="max-w-[1280px] px-4 md:px-6 lg:px-8 mx-auto py-8 min-h-screen">
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div class="col-span-3">
                                        <ArticleDocument v-if="post" :post="post" />
                                        <ArticleNavigator :prev="prevPost" :next="nextPost" />
                    <ArticleComments />
                </div>
                <div>
                    <AuthorPanel />
                    <LatestPostPanel />
                                        <ArticleTableOfContent :links="tocLinks" />
                </div>
            </div>
        </main>
                <PreviewBar v-if="previewCookie" />
        <Footer />
    </div>
</template>