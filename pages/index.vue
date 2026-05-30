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
const pageSize = 5

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
</script>

<template>
  <div class="bg-base-300 min-h-screen">

    <Head>
      <Title>Jacky FAN's Blog - A Personal Blog by Jacky FAN</Title>
    </Head>
    <NavBar />
    <main class="max-w-[1280px] px-4 md:px-6 lg:px-8 mx-auto py-8 min-h-screen">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div class="col-span-3">
          <!-- Show article list -->
          <div>
            <!-- for SEO -->
            <h1 class="hidden">Jacky FAN's Blog</h1>

            <div v-for="article in paginatedArticles" :key="article.id" class="bg-base-100 rounded-3xl shadow-md my-4 px-8 py-12">
              <article class="prose prose-slate w-full inline">
                <h2 class="mb-0 text-2xl">
                  <NuxtLink :to="buildArticlePath(article.slug)" class="no-underline hover:text-blue-500 transition-all">
                    {{ article.title }}
                  </NuxtLink>
                </h2>
                <small v-if="article.publishedDate">
                  <IconsDateIcon className="h-[1rem] mb-1 mr-1 inline" />{{ formatPayloadDate(article.publishedDate) }}
                </small>
                <p>{{ article.description }}</p>
              </article>
            </div>
          </div>
          <div v-if="totalPages > 1" class="my-4 px-8 pt-12 lg:pb-4 text-center">
            <div class="join">
              <input class="join-item btn btn-square" type="radio" name="options" :aria-label="(n).toString()"
                @click="setPage(n)" :checked="n === page"
                v-for="n in totalPages" :key="n" />
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
