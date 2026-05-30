<template>
    <div class="bg-base-100 rounded-lg shadow-md my-4 px-8 py-12 hidden lg:block sticky top-4">
        <div class="prose">
            <h4 class="text-xl">
                <IconsTableOfContent className="inline h-[1.2em] mb-1 mr-1" />
                Table of Content
            </h4>
            <ul v-if="links.length">
                <li v-for="link in links" :key="link.id" :class="{ 'pl-4': link.depth > 2 }">
                    <a :href="`#${link.id}`" class="hover:text-blue-500 no-underline font-normal transition-all">
                        {{ link.text }}
                    </a>
                </li>
            </ul>
            <p v-else class="text-sm text-base-content/60">No headings in this post.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { PayloadTocLink } from '~/types/payload'

defineProps<{
  links: PayloadTocLink[]
}>()
</script>