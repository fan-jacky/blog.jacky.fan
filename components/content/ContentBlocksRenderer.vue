<script setup lang="ts">
import type { PayloadContentBlock } from '~/types/payload'

defineProps<{
  blocks: PayloadContentBlock[]
}>()
</script>

<template>
  <div class="w-full my-6">
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
    </template>
  </div>
</template>