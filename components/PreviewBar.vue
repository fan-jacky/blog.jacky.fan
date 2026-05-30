<script setup lang="ts">
const previewCookie = useCookie('payload-preview')
const isPreview = computed(() => !!previewCookie.value)
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isPreview"
      class="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between bg-yellow-400 px-4 py-2 text-sm font-semibold text-black shadow-lg"
    >
      <span>⚠️ Preview Mode — this content may not be published yet</span>
      <a
        href="/api/disable-preview"
        class="ml-4 rounded bg-black px-3 py-1 text-white hover:bg-gray-800 transition-colors"
      >
        Exit Preview
      </a>
    </div>
  </Teleport>
</template>
