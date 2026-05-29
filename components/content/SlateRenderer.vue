<script setup lang="ts">
/**
 * Renders Payload CMS Slate rich text JSON into HTML.
 * Handles common block types: headings, paragraphs, lists, blockquotes, code,
 * links, and inline marks (bold, italic, underline, strikethrough, code).
 */
import type { SlateLeaf, SlateNode } from '~/types/slate'

const props = defineProps<{
  nodes: SlateNode[]
}>()

function isLeaf(node: SlateNode | SlateLeaf): node is SlateLeaf {
  return typeof (node as SlateLeaf).text === 'string' && !(node as SlateNode).type
}

function serializeLeaf(leaf: SlateLeaf): string {
  let text = leaf.text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  if (leaf.bold) text = `<strong>${text}</strong>`
  if (leaf.italic) text = `<em>${text}</em>`
  if (leaf.underline) text = `<u>${text}</u>`
  if (leaf.strikethrough) text = `<s>${text}</s>`
  if (leaf.code) text = `<code class="bg-base-300 rounded px-1 text-sm">${text}</code>`

  return text
}

function serializeChildren(children: Array<SlateNode | SlateLeaf> = []): string {
  return children
    .map((child) => {
      if (isLeaf(child)) return serializeLeaf(child)
      return serializeNode(child)
    })
    .join('')
}

function sanitizeURL(url: string | undefined): string {
  if (!url) return '#'
  try {
    const parsed = new URL(url)
    // Only allow safe protocols
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return url
    }
  } catch {
    // relative paths are fine
    if (/^\//.test(url)) return url
  }
  return '#'
}

function serializeNode(node: SlateNode): string {
  const inner = serializeChildren(node.children)

  switch (node.type) {
    case 'h1':
      return `<h1>${inner}</h1>`
    case 'h2':
      return `<h2>${inner}</h2>`
    case 'h3':
      return `<h3>${inner}</h3>`
    case 'h4':
      return `<h4>${inner}</h4>`
    case 'h5':
      return `<h5>${inner}</h5>`
    case 'h6':
      return `<h6>${inner}</h6>`
    case 'ul':
      return `<ul>${inner}</ul>`
    case 'ol':
      return `<ol>${inner}</ol>`
    case 'li':
      return `<li>${inner}</li>`
    case 'blockquote':
      return `<blockquote>${inner}</blockquote>`
    case 'code':
      return `<pre><code>${inner}</code></pre>`
    case 'link': {
      const href = sanitizeURL(node.url)
      const target = node.newTab ? ' target="_blank" rel="noopener noreferrer"' : ''
      return `<a href="${href}"${target}>${inner}</a>`
    }
    case 'upload':
      return '' // uploaded media within content not rendered here
    default:
      // paragraph or unknown — fall back to <p>
      return inner ? `<p>${inner}</p>` : ''
  }
}

const html = computed(() =>
  (props.nodes ?? []).map((n) => serializeNode(n)).join('')
)
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div class="prose prose-slate w-full" v-html="html" />
</template>
