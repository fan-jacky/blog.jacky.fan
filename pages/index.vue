<script setup lang="ts">
import type { PayloadPostSummary } from '~/types/payload'
import {
  buildArticlePath,
  formatPayloadDate,
  getPrimaryPayloadTag,
  resolvePayloadMediaAlt,
  resolvePayloadMediaUrl,
} from '~/utils/payloadPost'

useHead({
  title: "Jacky FAN's Blog - A Personal Blog by Jacky FAN",
  meta: [
    {
      name: 'description',
      content: "Welcome to Jacky FAN's Blog, where I share my passion for all the things I love, including programming, technology and so on.",
    },
    {
      name: 'keywords',
      content: "Jacky FAN, Blog, Personal Blog, Jacky FAN's Blog",
    },
  ],
})

const runtimeConfig = useRuntimeConfig()

const { data: articles } = await useFetch<PayloadPostSummary[]>('/api/payload-posts', {
  key: 'homepage-articles',
})

const featuredArticle = computed(() => articles.value?.[0] ?? null)
const recentArticles = computed(() => (articles.value ?? []).slice(0, 6))

function getFeaturedImageUrl(article: PayloadPostSummary) {
  return resolvePayloadMediaUrl(article.featuredImage, runtimeConfig)
}

function getFeaturedImageAlt(article: PayloadPostSummary) {
  return resolvePayloadMediaAlt(article.title, article.featuredImage)
}
</script>

<template>
  <div class="site-wrapper">
    <Head>
      <Title>Jacky FAN's Blog - A Personal Blog by Jacky FAN</Title>
    </Head>
    <NavBar />
    <main id="main-content" class="site-main">
      <section class="site-section blog-hero">
        <div class="geo-circle geo-circle--lg" />
        <div class="geo-accent" style="top:60%;right:-100px;" />
        <div class="container">
          <h1 class="sr-only">Jacky FAN's Blog</h1>
          <NuxtLink v-if="featuredArticle" :to="buildArticlePath(featuredArticle.slug)" class="blog-hero__grid">
            <div class="blog-hero__content reveal">
              <span class="section-label">Latest Article</span>
              <h2 class="blog-hero__title">{{ featuredArticle.title }}</h2>
              <p v-if="featuredArticle.description" class="blog-hero__desc">{{ featuredArticle.description }}</p>
              <div class="blog-hero__meta">
                <span v-if="getPrimaryPayloadTag(featuredArticle.tags)" class="tag-pill">{{ getPrimaryPayloadTag(featuredArticle.tags) }}</span>
                <span v-if="featuredArticle.publishedDate">{{ formatPayloadDate(featuredArticle.publishedDate) }}</span>
                <span>·</span>
                <span>{{ featuredArticle.readTime || 1 }} min read</span>
              </div>
            </div>
            <div class="blog-hero__image reveal">
              <img
                v-if="getFeaturedImageUrl(featuredArticle)"
                :src="getFeaturedImageUrl(featuredArticle)"
                :alt="getFeaturedImageAlt(featuredArticle)"
                loading="eager"
              >
              <div v-else class="blog-hero__placeholder">{{ featuredArticle.title }}</div>
            </div>
          </NuxtLink>
        </div>
      </section>

      <section class="site-section site-section--tinted">
        <div class="geo-circle geo-circle--md" />
        <div class="container">
          <span class="section-label reveal">Recent Articles</span>
          <h2 class="section-headline reveal">Latest Writing</h2>
          <p class="section-subtitle reveal">Notes on programming, dev tooling, self-hosting, and more.</p>

          <div class="article-grid reveal-stagger" style="margin-top: 3rem;">
            <NuxtLink v-for="article in recentArticles" :key="article.id" :to="buildArticlePath(article.slug)" class="article-card">
              <div class="article-card__image">
                <img
                  v-if="getFeaturedImageUrl(article)"
                  :src="getFeaturedImageUrl(article)"
                  :alt="getFeaturedImageAlt(article)"
                  loading="lazy"
                >
                <div v-else class="article-card__placeholder">{{ article.title }}</div>
              </div>
              <div class="article-card__body">
                <div class="article-card__meta">
                  <span v-if="getPrimaryPayloadTag(article.tags)" class="tag-pill">{{ getPrimaryPayloadTag(article.tags) }}</span>
                  <span v-if="article.publishedDate">{{ formatPayloadDate(article.publishedDate) }}</span>
                </div>
                <h3 class="article-card__title">{{ article.title }}</h3>
                <p v-if="article.description" class="article-card__excerpt">{{ article.description }}</p>
              </div>
            </NuxtLink>
          </div>

          <div class="show-more reveal">
            <NuxtLink to="/articles" class="show-more__button">View all articles →</NuxtLink>
          </div>
        </div>
      </section>

      <section class="site-section site-section--dark about-blurb">
        <div class="geo-circle geo-circle--lg" style="border-color:rgba(245,243,239,0.06);top:-80px;right:-80px;" />
        <div class="geo-accent" style="top:auto;bottom:-100px;right:-80px;" />
        <div class="container">
          <div class="about-blurb__inner reveal">
            <h2 class="about-blurb__title">Hi, I'm Jacky</h2>
            <p class="about-blurb__text">A frontend developer based in Hong Kong. I write about web development, dev tooling, self-hosting, and the occasional hardware experiment.</p>
            <NuxtLink to="/about" class="about-blurb__link">More about me →</NuxtLink>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
</template>
