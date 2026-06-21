<script setup lang="ts">
import type { PayloadPostSummary } from '~/types/payload'
import { buildArticlePath, formatPayloadDate } from '~/utils/payloadPost'

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

const page = ref(1)
const pageSize = 9
// const fallbackFeaturedImage = 'https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp'

const { data: articles } = await useFetch<PayloadPostSummary[]>('/api/payload-posts', {
  key: 'homepage-articles',
})

const totalPages = computed(() => Math.ceil((articles.value?.length ?? 0) / pageSize))

const paginatedArticles = computed(() => {
  const start = (page.value - 1) * pageSize
  return (articles.value ?? []).slice(start, start + pageSize)
})

function setPage(nextPage: number) {
  page.value = nextPage
}

function resolveFeaturedImageUrl(article: PayloadPostSummary) {
  const image = article.featuredImage

  if (!image || typeof image !== 'object' || !image.url) {
    // return fallbackFeaturedImage
    return;
  }

  try {
    return new URL(image.url).toString()
  } catch {
    const config = useRuntimeConfig()
    const base = config.public.payloadUrl || config.payloadUrl

    if (!base) {
      return image.url
    }

    try {
      return new URL(image.url, base).toString()
    } catch {
      return image.url
    }
  }
}

function resolveFeaturedImageAlt(article: PayloadPostSummary) {
  const image = article.featuredImage

  if (image && typeof image === 'object' && image.alt?.trim()) {
    return image.alt
  }

  return `${article.title} featured image`
}
</script>

<template>
  <div class="bg-base-300 min-h-screen">

    <Head>
      <Title>Jacky FAN's Blog - A Personal Blog by Jacky FAN</Title>
    </Head>
    <NavBar />
    <main class="container px-4 md:px-6 lg:px-8 mx-auto py-8 min-h-screen">
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div class="col-span-4">
          <!-- Show article list -->
          <div>
            <!-- for SEO -->
            <h1 class="hidden">Jacky FAN's Blog</h1>

            <div class="flex flex-wrap gap-4 justify-center">
              <NuxtLink :to="buildArticlePath(article.slug)" v-for="article in paginatedArticles" :key="article.id"
                class="card bg-base-100 w-full sm:w-80 shadow-sm transition-all hover:scale-105 duration-300">
                <figure class="article-card-gradient aspect-video" v-if="article.featuredImage">
                  <img :src="resolveFeaturedImageUrl(article)" :alt="resolveFeaturedImageAlt(article)"
                    class="h-full w-full object-cover" />
                </figure>
                <div class="article-card-gradient aspect-video" v-else>
                  <div class="flex items-center justify-center h-full w-full text-white text-3xl font-bold">
                  </div>
                </div>
                <div class="card-body p-6">
                  <h2 class="card-title">{{ article.title }}</h2>
                  <small v-if="article.publishedDate">
                    <IconsDateIcon class="h-[1rem] mb-1 mr-1 inline" />{{ formatPayloadDate(article.publishedDate)
                    }}
                  </small>
                </div>
              </NuxtLink>
            </div>

          </div>
          <div v-if="totalPages > 1" class="my-4 px-8 pt-12 lg:pb-4 text-center">
            <div class="join">
              <input class="join-item btn btn-square px-3" type="radio" name="options" :aria-label="(n).toString()"
                @click="setPage(n)" :checked="n === page" v-for="n in totalPages" :key="n" />
            </div>
          </div>
        </div>
        <div>
          <AuthorPanel />
          <LatestPostPanel />
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>
