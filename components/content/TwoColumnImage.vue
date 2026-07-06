<script setup lang="ts">
import type { PayloadMedia } from '~/types/payload'
import { resolvePayloadMediaUrl, resolvePayloadMediaAlt } from '~/utils/payloadPost'

const props = defineProps<{
  leftImage: PayloadMedia
  leftCaption?: string | null
  rightImage?: PayloadMedia | null
  rightCaption?: string | null
}>()

const runtimeConfig = useRuntimeConfig()

const leftUrl = computed(() => resolvePayloadMediaUrl(props.leftImage, runtimeConfig))
const leftAlt = computed(() => resolvePayloadMediaAlt('Left image', props.leftImage))
const isLeftWebM = computed(() => props.leftImage?.mimeType === 'video/webm')

const rightUrl = computed(() => {
  if (!props.rightImage) return null
  return resolvePayloadMediaUrl(props.rightImage, runtimeConfig)
})
const rightAlt = computed(() => {
  if (!props.rightImage) return ''
  return resolvePayloadMediaAlt('Right image', props.rightImage)
})
const isRightWebM = computed(() => props.rightImage?.mimeType === 'video/webm')
</script>

<template>
  <figure
    class="two-col-image"
    :class="{ 'two-col-image--single': !rightUrl }"
  >
    <div class="two-col-image__grid">
      <div class="two-col-image__col">
        <div class="two-col-image__item">
          <video
            v-if="isLeftWebM"
            :src="leftUrl"
            autoplay
            loop
            muted
            playsinline
            :aria-label="leftAlt"
            class="two-col-image__media"
          />
          <img
            v-else
            :src="leftUrl"
            :alt="leftAlt"
            loading="lazy"
            class="two-col-image__media"
          >
        </div>
        <figcaption v-if="leftCaption" class="two-col-image__caption">
          {{ leftCaption }}
        </figcaption>
      </div>
      <div v-if="rightUrl" class="two-col-image__col">
        <div class="two-col-image__item">
          <video
            v-if="isRightWebM"
            :src="rightUrl"
            autoplay
            loop
            muted
            playsinline
            :aria-label="rightAlt"
            class="two-col-image__media"
          />
          <img
            v-else
            :src="rightUrl"
            :alt="rightAlt"
            loading="lazy"
            class="two-col-image__media"
          >
        </div>
        <figcaption v-if="rightCaption" class="two-col-image__caption">
          {{ rightCaption }}
        </figcaption>
      </div>
    </div>
  </figure>
</template>

<style scoped>
.two-col-image {
  margin: 2rem 0;
}

.two-col-image__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.two-col-image--single .two-col-image__grid {
  grid-template-columns: 1fr;
}

.two-col-image__item {
  overflow: hidden;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: var(--bg-secondary);
}

.two-col-image__media {
  display: block;
  width: 100%;
  height: auto;
  object-fit: cover;
}

.two-col-image__caption {
  margin-top: 0.75rem;
  padding-bottom: 0.5rem;
  color: var(--text-muted);
  font-size: 0.8125rem;
  line-height: 1.5;
  text-align: center;
}

@media (max-width: 768px) {
  .two-col-image__grid {
    grid-template-columns: 1fr;
  }
}
</style>
