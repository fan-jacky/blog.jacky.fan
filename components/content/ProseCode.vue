<template>
    <div class="mockup-code prose-mockup-code shadow relative rounded-2xl">
        <slot />
        <button class="btn btn-square btn-sm absolute bottom-4 right-4 opacity-95 flex justify-center items-center" aria-label="Copy Code"
            @click="copyToClipboard(code)">
            <IconsCopyClipboard class="p-1" />
        </button>
    </div>
    <p v-if="filename" class="text-center">
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
  
<style>
.prose-mockup-code pre {
    padding-block: 0;
    margin-block: 12px 4px;
}

.prose-mockup-code pre:before {
    content: unset;
}

.prose-mockup-code pre code span.line {
    padding-left: 8px;
}

.prose-mockup-code pre code span.line:before {
    content: attr(line);
    display: inline-block;
    width: 28px;
    opacity: .5;
    pointer-events: none;
}
</style>