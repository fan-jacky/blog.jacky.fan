<script setup lang="ts">
import type { PayloadPostSummary } from '~/types/payload'
import {
  buildArticlePath,
  formatPayloadDate,
  getPrimaryPayloadTag,
  parsePayloadTags,
  resolvePayloadMediaAlt,
  resolvePayloadMediaUrl,
} from '~/utils/payloadPost'

useHead({
  title: 'All Articles — Jacky FAN',
  meta: [
    {
      name: 'description',
      content: 'Browse all articles by Jacky FAN — filter by topic and search across the archive.',
    },
  ],
})

const runtimeConfig = useRuntimeConfig()
const searchQuery = ref('')
const activeFilter = ref('all')
const activeSort = ref<'newest' | 'oldest' | 'az'>('newest')

const { data: articles } = await useFetch<PayloadPostSummary[]>('/api/payload-posts', {
  key: 'articles-archive',
})

const categoryOptions = computed(() => {
  const uniqueTags = new Set<string>()

  for (const article of articles.value ?? []) {
    for (const tag of parsePayloadTags(article.tags)) {
      uniqueTags.add(tag)
    }
  }

  return Array.from(uniqueTags).sort((left, right) => left.localeCompare(right))
})

const filteredArticles = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return [...(articles.value ?? [])]
    .filter((article) => {
      const tags = parsePayloadTags(article.tags)
      const matchesFilter = activeFilter.value === 'all' || tags.some((tag) => tag.toLowerCase() === activeFilter.value.toLowerCase())

      if (!matchesFilter) {
        return false
      }

      if (!query) {
        return true
      }

      return [article.title, article.description ?? '', article.tags ?? '']
        .join(' ')
        .toLowerCase()
        .includes(query)
    })
    .sort((left, right) => {
      if (activeSort.value === 'az') {
        return left.title.localeCompare(right.title)
      }

      const leftDate = left.publishedDate ?? ''
      const rightDate = right.publishedDate ?? ''

      return activeSort.value === 'oldest'
        ? leftDate.localeCompare(rightDate)
        : rightDate.localeCompare(leftDate)
    })
})

function resetFilters() {
  searchQuery.value = ''
  activeFilter.value = 'all'
  activeSort.value = 'newest'
}

function getImageUrl(article: PayloadPostSummary) {
  return resolvePayloadMediaUrl(article.featuredImage, runtimeConfig)
}

function getImageAlt(article: PayloadPostSummary) {
  return resolvePayloadMediaAlt(article.title, article.featuredImage)
}
</script>

<template>
  <div class="site-wrapper">
    <NavBar />
    <main id="main-content" class="site-main">
      <section class="site-section site-section--listing">
        <div class="geo-circle geo-circle--sm" style="top:10%;right:8%;" />
        <div class="container">
          <div class="article-listing__header reveal">
            <span class="section-label">Browse</span>
            <h1 class="section-headline">All Articles</h1>
            <p class="section-subtitle">Browse the full archive — filter by topic or search by title and excerpt.</p>
          </div>

          <div class="article-listing__filters reveal">
            <div class="article-listing__filters-row">
              <div class="article-listing__search">
                <svg class="article-listing__search-icon" viewBox="0 0 16 16" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="currentColor" stroke-width="1.5" /><path d="M10.5 10.5L14 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" /></svg>
                <label for="searchInput" class="sr-only">Search articles</label>
                <input id="searchInput" v-model="searchQuery" type="text" class="article-listing__input" placeholder="Search articles...">
              </div>
            </div>
            <div class="article-listing__filters-row">
              <div class="article-listing__group">
                <label class="article-listing__label" for="filterSelect">Category</label>
                <select id="filterSelect" v-model="activeFilter" class="article-listing__select">
                  <option value="all">All categories</option>
                  <option v-for="option in categoryOptions" :key="option" :value="option">{{ option }}</option>
                </select>
              </div>
              <div class="article-listing__group">
                <label class="article-listing__label" for="sortSelect">Sort</label>
                <select id="sortSelect" v-model="activeSort" class="article-listing__select">
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="az">A → Z</option>
                </select>
              </div>
              <button type="button" class="article-listing__reset" @click="resetFilters">Reset</button>
            </div>
          </div>

          <div class="article-listing__count reveal">{{ filteredArticles.length }} articles</div>

          <div v-if="filteredArticles.length" class="article-list reveal">
            <NuxtLink
              v-for="article in filteredArticles"
              :key="article.id"
              :to="buildArticlePath(article.slug)"
              class="article-list-item"
            >
              <div class="article-list-item__image">
                <img v-if="getImageUrl(article)" :src="getImageUrl(article)" :alt="getImageAlt(article)" loading="lazy">
                <div v-else class="article-list-item__placeholder">{{ article.title }}</div>
              </div>
              <div class="article-list-item__content">
                <div class="article-list-item__meta">
                  <span v-if="getPrimaryPayloadTag(article.tags)" class="tag-pill">{{ getPrimaryPayloadTag(article.tags) }}</span>
                  <span v-if="article.publishedDate">{{ formatPayloadDate(article.publishedDate) }}</span>
                  <span v-if="article.readTime">·</span>
                  <span v-if="article.readTime">{{ article.readTime }} min read</span>
                </div>
                <h2 class="article-list-item__title">{{ article.title }}</h2>
                <p v-if="article.description" class="article-list-item__excerpt">{{ article.description }}</p>
              </div>
            </NuxtLink>
          </div>

          <p v-else class="article-listing__empty reveal">No articles match the current filters.</p>
        </div>
      </section>
    </main>
    <Footer />
  </div>
</template>