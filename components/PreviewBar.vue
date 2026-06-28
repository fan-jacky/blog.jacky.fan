<script setup lang="ts">
const previewCookie = useCookie('payload-preview')
const isPreview = computed(() => !!previewCookie.value)
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
