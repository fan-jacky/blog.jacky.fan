<script setup lang="ts">
import type { PayloadContentBlock } from '~/types/payload'
import DOMPurify from 'isomorphic-dompurify'

const ALLOWED_TAGS = [
  // text & structure
  'p', 'br', 'hr', 'span', 'div',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'strong', 'b', 'em', 'i', 'u', 's', 'sub', 'sup', 'code', 'mark', 'small',
  'blockquote', 'pre',
  'ul', 'ol', 'li',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'colgroup', 'col',
  'figure', 'figcaption',
  'a', 'img',
]

function sanitizedCkHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR: ['href', 'src', 'srcset', 'alt', 'title', 'target', 'rel', 'colspan', 'rowspan', 'width', 'height', 'class', 'style'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form'],
    KEEP_CONTENT: true,
  })
}

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
      <div
        v-else-if="block.blockType === 'ckRichText'"
        class="article-prose ck-rich-text"
        v-html="sanitizedCkHtml(block.body ?? '')"
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
        :left-caption="block.leftCaption"
        :right-image="block.rightImage"
        :right-caption="block.rightCaption"
      />
    </template>
  </div>
</template>