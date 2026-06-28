<script setup lang="ts">
import type { PayloadPost, PayloadPostSummary } from '~/types/payload'
import { normalizePayloadSlug, parsePayloadTags } from '~/utils/payloadPost'

const route = useRoute()
const slug = normalizePayloadSlug(route.params.slug as string | string[] | undefined)
const post = ref<PayloadPost | null>(null)
const posts = ref<PayloadPostSummary[]>([])

if (!slug) {
    await navigateTo('/', { redirectCode: 301 })
}
else {
    const [{ data: fetchedPost, error }, { data: fetchedPosts }] = await Promise.all([
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

    post.value = fetchedPost.value ?? null
    posts.value = fetchedPosts.value ?? []
}

const previewCookie = useCookie('payload-preview')

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

const relatedPosts = computed(() => {
    const current = post.value

    if (!current) {
        return []
    }

    const currentTags = new Set(parsePayloadTags(current.tags).map((tag) => tag.toLowerCase()))

    return (posts.value ?? [])
        .filter(({ slug: entrySlug }) => entrySlug !== current.slug)
        .map((entry) => {
            const entryTags = parsePayloadTags(entry.tags).map((tag) => tag.toLowerCase())
            const sharedScore = entryTags.filter((tag) => currentTags.has(tag)).length

            return { entry, sharedScore }
        })
        .sort((left, right) => right.sharedScore - left.sharedScore)
        .slice(0, 3)
        .map(({ entry }) => entry)
})

useHead(() => ({
    title: post.value?.title ?? 'Article',
    meta: post.value?.description
        ? [{ name: 'description', content: post.value.description }]
        : [],
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
                    <ArticleDocument v-if="post" :post="post" :related-posts="relatedPosts" />
                    <ArticleNavigator :prev="prevPost" :next="nextPost" />
                </div>
            </section>
        </main>
        <PreviewBar v-if="previewCookie" />
        <Footer />
    </div>
</template>