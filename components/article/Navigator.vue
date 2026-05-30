<script setup lang="ts">
import type { PayloadPostSummary } from '~/types/payload'
import { buildArticlePath } from '~/utils/payloadPost'

defineProps<{
  prev: PayloadPostSummary | null
  next: PayloadPostSummary | null
}>()
</script>

<template>
    <div class="flex max-w-full">
        <NuxtLink v-if="prev" :to="buildArticlePath(prev.slug)" class="flex-shrink bg-base-100 rounded-lg shadow-md my-4 px-4 md:px-8 py-6 md:py-12 w-5/12 md:w-fit">
            <div class="flex h-full w-full">
                <IconsArrowLeft className="h-[1.2rem] my-auto hidden md:inline mr-4" />
                <div class="prose max-w-full">
                    <small>Previous Article</small>
                    <h6 class="font-bold truncate"> {{ prev.title }} </h6>
                </div>
            </div>
        </NuxtLink>
        <div class="grow" />
        <NuxtLink v-if="next" :to="buildArticlePath(next.slug)" class="flex-shrink bg-base-100 rounded-lg shadow-md my-4 px-4 md:px-8 py-6 md:py-12 w-5/12 md:w-fit">
            <div class="flex h-full w-full">
                <div class="prose max-w-full">
                    <small>Next Article</small>
                    <h6 class="font-bold truncate"> {{ next.title }} </h6>
                </div>
                <IconsArrowRight className="h-[1.2rem] my-auto hidden md:inline ml-4" />
            </div>
        </NuxtLink>
    </div>
</template>
