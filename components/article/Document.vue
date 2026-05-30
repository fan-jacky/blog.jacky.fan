<script setup lang="ts">
import type { PayloadPost } from '~/types/payload'
import SlateRenderer from '~/components/content/SlateRenderer.vue'
import { estimateReadTime, formatPayloadDate } from '~/utils/payloadPost'

const props = defineProps<{
    post: PayloadPost
}>()

const formattedDate = computed(() => formatPayloadDate(props.post.publishedDate))
const readTime = computed(() => estimateReadTime(props.post.content ?? []))
const contentNodes = computed(() => props.post.content ?? [])
const hasContent = computed(() => contentNodes.value.length > 0)
</script>

<template>
    <div class="bg-base-100 rounded-3xl shadow-md my-4 px-4 md:px-8 py-12">
        <div class="breadcrumbs mb-2">
            <ul class="text-sm">
                <li class="prose text-sm">
                    <NuxtLink to="/" class="no-underline hover:text-blue-500">Home</NuxtLink>
                </li>
                <li class="prose text-sm">{{ post.title }}</li>
            </ul>
        </div>
        <div
            v-if="post.status === 'draft'"
            class="mb-4 inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800"
        >
            Draft
        </div>
        <article class="prose prose-slate w-full inline">
            <h1>{{ post.title }}</h1>
            <hr class="m-0 mb-2" />
            <small>
                <template v-if="formattedDate">
                    <IconsDateIcon class="w-auto h-[1.2em] mb-1 mr-1 inline" />{{ formattedDate }}
                </template>
                <template v-if="post.author">
                    &nbsp;|&nbsp;
                    <IconsPersonIcon class="w-auto h-[1.2em] mb-1 mr-1 inline" />{{ post.author }}
                </template>
                &nbsp;|&nbsp;
                <IconsClock class="w-auto h-[1.2em] mb-1 mr-1 inline" />{{ readTime }} min read
            </small>
            <SlateRenderer
                v-if="hasContent"
                :nodes="contentNodes"
            />
            <p v-else class="text-base-content/50 italic">No content yet.</p>
        </article>
    </div>
</template>
