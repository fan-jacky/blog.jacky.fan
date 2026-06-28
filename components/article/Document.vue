<script setup lang="ts">
import type { PayloadPost, PayloadPostSummary } from '~/types/payload'
import {
    buildArticlePath,
    estimateContentBlocksReadTime,
    formatPayloadDate,
    getPrimaryPayloadTag,
    resolvePayloadMediaAlt,
    resolvePayloadMediaUrl,
} from '~/utils/payloadPost'

const props = defineProps<{
    post: PayloadPost
    relatedPosts?: PayloadPostSummary[]
}>()

const runtimeConfig = useRuntimeConfig()
const formattedDate = computed(() => formatPayloadDate(props.post.publishedDate))
const contentBlocks = computed(() => props.post.content ?? [])
const readTime = computed(() => estimateContentBlocksReadTime(contentBlocks.value))
const hasContent = computed(() => contentBlocks.value.length > 0)
const primaryTag = computed(() => getPrimaryPayloadTag(props.post.tags))
const heroImageUrl = computed(() => resolvePayloadMediaUrl(props.post.featuredImage, runtimeConfig))
const heroImageAlt = computed(() => resolvePayloadMediaAlt(props.post.title, props.post.featuredImage))
const relatedPosts = computed(() => props.relatedPosts ?? [])
</script>

<template>
    <article>
        <div class="article-page__hero">
            <div v-if="heroImageUrl" class="article-page__hero-image">
                <img :src="heroImageUrl" :alt="heroImageAlt">
            </div>
            <div v-else class="article-page__hero-image article-page__hero-placeholder">
                {{ post.title }}
            </div>
        </div>

        <header class="article-page__header">
            <span v-if="primaryTag" class="section-label">{{ primaryTag }}</span>
            <div v-if="post.status === 'draft'" class="tag-pill">Draft</div>
            <h1 class="article-page__title">{{ post.title }}</h1>
            <p v-if="post.description" class="article-page__excerpt">{{ post.description }}</p>
            <div class="article-page__meta">
                <span v-if="formattedDate">{{ formattedDate }}</span>
                <span v-if="formattedDate && post.author">·</span>
                <span v-if="post.author">{{ post.author }}</span>
                <span v-if="formattedDate || post.author">·</span>
                <span>{{ readTime }} min read</span>
            </div>
        </header>

        <div class="article-page__body">
            <ContentBlocksRenderer v-if="hasContent" :blocks="contentBlocks" />
            <p v-else class="article-page__empty">No content yet.</p>

            <section class="article-author">
                <div class="article-author__label">Written by</div>
                <div class="article-author__card">
                    <div class="article-author__avatar">JF</div>
                    <div>
                        <h2 class="article-author__name">{{ post.author || 'Jacky FAN' }}</h2>
                        <p class="article-author__bio">Frontend developer based in Hong Kong. Writing about web development, dev tooling, self-hosting, and the occasional hardware experiment.</p>
                    </div>
                    <div class="article-author__links">
                        <a href="https://jacky.fan" target="_blank" rel="noopener" class="article-author__link" aria-label="Portfolio">
                            <svg viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="2.5" stroke="currentColor" stroke-width="1.2" /><circle cx="8" cy="8" r="2.5" stroke="currentColor" stroke-width="1.2" /></svg>
                        </a>
                        <a href="https://github.com/redfrogsss" target="_blank" rel="noopener" class="article-author__link" aria-label="GitHub">
                            <svg viewBox="0 0 16 16" fill="none"><path d="M8 1C4.13 1 1 4.13 1 8c0 3.1 2 5.72 4.78 6.65.35.06.48-.15.48-.33v-1.17c-1.94.42-2.35-.94-2.35-.94-.32-.81-.78-1.03-.78-1.03-.63-.43.05-.42.05-.42.7.05 1.07.72 1.07.72.62 1.07 1.64.76 2.04.58.06-.45.24-.76.44-.94-1.56-.18-3.2-.78-3.2-3.47 0-.77.27-1.4.72-1.89-.07-.17-.31-.88.07-1.83 0 0 .58-.19 1.9.71a6.6 6.6 0 013.48 0c1.32-.9 1.9-.71 1.9-.71.38.95.14 1.66.07 1.83.45.49.72 1.12.72 1.89 0 2.7-1.64 3.29-3.21 3.46.25.22.48.65.48 1.3v1.93c0 .18.12.4.48.33A7 7 0 0015 8c0-3.87-3.13-7-7-7z" fill="currentColor" /></svg>
                        </a>
                        <a href="/rss.xml" class="article-author__link" aria-label="RSS feed">
                            <svg viewBox="0 0 16 16" fill="none"><circle cx="3" cy="13" r="1.5" fill="currentColor" /><path d="M1 6a9 9 0 019 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" /><path d="M1 2a13 13 0 0113 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" /></svg>
                        </a>
                    </div>
                </div>
            </section>

            <section v-if="relatedPosts.length" class="article-related">
                <div class="article-related__header">
                    <span class="article-related__title">Continue Reading</span>
                    <NuxtLink to="/articles" class="article-related__view-all">View all articles →</NuxtLink>
                </div>
                <div class="article-related__grid">
                    <NuxtLink
                        v-for="relatedPost in relatedPosts"
                        :key="relatedPost.id"
                        :to="buildArticlePath(relatedPost.slug)"
                        class="article-card"
                    >
                        <div class="article-card__image">
                            <img
                                v-if="resolvePayloadMediaUrl(relatedPost.featuredImage, runtimeConfig)"
                                :src="resolvePayloadMediaUrl(relatedPost.featuredImage, runtimeConfig)"
                                :alt="resolvePayloadMediaAlt(relatedPost.title, relatedPost.featuredImage)"
                                loading="lazy"
                            >
                            <div v-else class="article-card__placeholder">{{ relatedPost.title }}</div>
                        </div>
                        <div class="article-card__body">
                            <div class="article-card__meta">
                                <span v-if="getPrimaryPayloadTag(relatedPost.tags)" class="tag-pill">{{ getPrimaryPayloadTag(relatedPost.tags) }}</span>
                                <span v-if="relatedPost.publishedDate">{{ formatPayloadDate(relatedPost.publishedDate) }}</span>
                            </div>
                            <h3 class="article-card__title">{{ relatedPost.title }}</h3>
                        </div>
                    </NuxtLink>
                </div>
            </section>
        </div>
    </article>
</template>
