<script setup lang="ts">
import { onMounted, ref } from 'vue'

const isPreview = ref(false)

onMounted(() => {
  // Same non-httpOnly flag cookie that /api/preview sets. The value carries
  // no sensitive data — it is merely a flag.
  isPreview.value = document.cookie.split(/;\s*/).some((cookie) => cookie === 'payload-preview=1')
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isPreview"
      class="preview-banner"
    >
      <span class="preview-banner__text">Preview mode — this content may not be published yet.</span>
      <a
        href="/api/disable-preview"
        class="preview-banner__action"
      >
        Exit Preview
      </a>
    </div>
  </Teleport>
</template>
