<script setup lang="ts">
import type { PayloadPostSummary } from '@/types/payload'
import { buildArticlePath } from './payloadPost'
import IconsArrowLeft from './icons/ArrowLeft.vue'
import IconsArrowRight from './icons/ArrowRight.vue'

defineProps<{
  prev: PayloadPostSummary | null
  next: PayloadPostSummary | null
}>()
</script>

<template>
    <div class="article-nav">
        <a v-if="prev" :href="buildArticlePath(prev.slug)" class="article-nav__item">
            <IconsArrowLeft class="article-nav__icon" />
            <span>
                <span class="article-nav__label">Previous Article</span>
                <span class="article-nav__title">{{ prev.title }}</span>
            </span>
        </a>
        <div v-else class="article-nav__spacer" />
        <a v-if="next" :href="buildArticlePath(next.slug)" class="article-nav__item article-nav__item--next">
            <span>
                <span class="article-nav__label">Next Article</span>
                <span class="article-nav__title">{{ next.title }}</span>
            </span>
            <IconsArrowRight class="article-nav__icon" />
        </a>
    </div>
</template>
