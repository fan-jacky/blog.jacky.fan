<script setup lang="ts">
import type { PayloadPostSummary } from '~/types/payload'
import { buildArticlePath } from '~/utils/payloadPost'

defineProps<{
  prev: PayloadPostSummary | null
  next: PayloadPostSummary | null
}>()
</script>

<template>
    <div class="article-nav">
        <NuxtLink v-if="prev" :to="buildArticlePath(prev.slug)" class="article-nav__item">
            <IconsArrowLeft class="article-nav__icon" />
            <span>
                <span class="article-nav__label">Previous Article</span>
                <span class="article-nav__title">{{ prev.title }}</span>
            </span>
        </NuxtLink>
        <div v-else class="article-nav__spacer" />
        <NuxtLink v-if="next" :to="buildArticlePath(next.slug)" class="article-nav__item article-nav__item--next">
            <span>
                <span class="article-nav__label">Next Article</span>
                <span class="article-nav__title">{{ next.title }}</span>
            </span>
            <IconsArrowRight class="article-nav__icon" />
        </NuxtLink>
    </div>
</template>
