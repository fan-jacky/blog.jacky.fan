<script setup lang="ts">
import type { PayloadContentBlock } from '~/types/payload'

defineProps<{
  blocks: PayloadContentBlock[]
}>()
</script>

<template>
  <div class="article-content">
    <template v-for="(block, index) in blocks" :key="`${block.blockType}-${block.id ?? index}`">
      <SlateRenderer
        v-if="block.blockType === 'richText'"
        :nodes="block.body ?? []"
      />
      <PayloadCodeBlock
        v-else-if="block.blockType === 'codeBlock'"
        :code="block.code"
        :language="block.language"
        :show-line-numbers="block.showLineNumbers"
      />
      <TwoColumnImage
        v-else-if="block.blockType === 'twoColumnImage'"
        :left-image="block.leftImage"
        :right-image="block.rightImage"
        :caption="block.caption"
      />
    </template>
  </div>
</template>