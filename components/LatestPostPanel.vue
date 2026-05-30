<template>
    <div class="bg-base-100 rounded-2xl shadow-md my-4 px-8 py-8 hidden lg:block">
        <div class="prose">
            <h4 class="text-xl">
                <IconsNewsPaperIcon className="h-[1.2em] mb-1 inline" /> Latest Articles
            </h4>
            <div class="divide-y">
                <div v-if="posts?.length">
                    <div v-for="article in posts" :key="article.id" class="py-2">
                        <NuxtLink :to="buildArticlePath(article.slug)" class="mb-0 no-underline hover:text-blue-500 transition-all">{{
                            article.title
                        }}</NuxtLink>
                        <br />
                        {{ formatPayloadDate(article.publishedDate) }}
                    </div>
                </div>
                <div v-else>No Article Recently.</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { PayloadPostSummary } from '~/types/payload'
import { buildArticlePath, formatPayloadDate } from '~/utils/payloadPost'

const { data: posts } = await useFetch<PayloadPostSummary[]>('/api/payload-posts?limit=3', {
  key: 'latest-payload-posts',
})
</script>