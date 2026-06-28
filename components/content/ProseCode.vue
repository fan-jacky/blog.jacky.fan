<template>
    <div class="payload-code-block">
        <slot />
        <button class="payload-code-block__copy" aria-label="Copy Code" @click="copyToClipboard(code)">
            <IconsCopyClipboard class="p-1" />
        </button>
    </div>
    <p v-if="filename" class="article-prose__code-filename">
        <code>{{ filename }}</code>
    </p>
</template>
  
<script setup lang="ts">
import IconsCopyClipboard from '../icons/CopyClipboard.vue';

defineProps({
    code: {
        type: String,
        default: ''
    },
    language: {
        type: String,
        default: null
    },
    filename: {
        type: String,
        default: null
    },
    highlights: {
        type: Array as () => number[],
        default: () => []
    },
    meta: {
        type: String,
        default: null
    }
})

async function copyToClipboard(value = "") {
    return navigator.clipboard.writeText(value);
}
</script>
  