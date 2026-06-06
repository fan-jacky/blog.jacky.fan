<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const statusCode = computed(() => props.error?.statusCode ?? 404)
const statusMessage = computed(() => props.error?.statusMessage || 'Page not found')
const description = computed(
  () => props.error?.message || 'The page you requested does not exist or is no longer available.'
)
</script>

<template>
  <AppNotFound
    :status-code="statusCode"
    :status-message="statusMessage"
    :description="description"
  />
</template>