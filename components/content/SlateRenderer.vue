<script setup lang="ts">
import { defineComponent, h } from 'vue'
import type { VNodeChild } from 'vue'
import ProseCode from '~/components/content/ProseCode.vue'
import type { SlateLeaf, SlateNode } from '~/types/slate'
import { createHeadingId, extractTextFromSlate } from '~/utils/payloadPost'

const props = defineProps<{
  nodes: SlateNode[]
}>()

const config = useRuntimeConfig()
const activeImage = ref<{ alt: string, src: string } | null>(null)

function isLeaf(node: SlateNode | SlateLeaf): node is SlateLeaf {
  return typeof (node as SlateLeaf).text === 'string' && !(node as SlateNode).type
}

function renderLeaf(leaf: SlateLeaf): VNodeChild {
  let content: VNodeChild = leaf.text

  if (leaf.bold) content = h('strong', content)
  if (leaf.italic) content = h('em', content)
  if (leaf.underline) content = h('u', content)
  if (leaf.strikethrough) content = h('s', content)
  if (leaf.code) content = h('code', { class: 'bg-base-300 rounded px-1 text-sm' }, content)

  return content
}

function renderChildren(
  children: Array<SlateNode | SlateLeaf> = [],
  headingIds: Map<string, number>,
): VNodeChild[] {
  return children.map((child, index) => {
    if (isLeaf(child)) {
      return renderLeaf(child)
    }

    return renderNode(child, headingIds, index)
  })
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

function resolveMediaURL(url: string | undefined | null): string {
  if (!url) return ''

  try {
    return new URL(url).toString()
  } catch {
    const base = config.public.payloadUrl || config.payloadUrl

    if (!base) {
      return url
    }

    try {
      return new URL(url, base).toString()
    } catch {
      return url
    }
  }
}

function extractCodeText(children: Array<SlateNode | SlateLeaf> = []): string {
  return children
    .map((child) => {
      if (isLeaf(child)) {
        return child.text
      }

      return extractCodeText(child.children ?? [])
    })
    .join('')
}

function openImageModal(image: { alt: string, src: string }): void {
  activeImage.value = image
}

function closeImageModal(): void {
  activeImage.value = null
}

function renderUpload(node: SlateNode, key?: number | string): VNodeChild | null {
  const media = typeof node.value === 'object' && node.value !== null ? node.value : null
  const src = resolveMediaURL(media?.url)

  if (!src) {
    return null
  }

  const alt = media?.alt?.trim() || media?.filename?.trim() || 'Article image'
  const caption = media?.alt?.trim()

  return h('figure', [
    h(
      'button',
      {
        'aria-label': `Open full size image: ${alt}`,
        class: 'block w-full cursor-zoom-in border-0 bg-transparent p-0 text-left',
        key,
        type: 'button',
        onClick: () => openImageModal({ alt, src }),
      },
      [h('img', { alt, loading: 'lazy', src })],
    ),
    caption ? h('figcaption', caption) : null,
  ])
}

function renderNode(
  node: SlateNode,
  headingIds: Map<string, number>,
  key?: number | string,
): VNodeChild | null {
  const children = renderChildren(node.children ?? [], headingIds)

  switch (node.type) {
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6': {
      const headingText = extractTextFromSlate(node.children ?? [])
      const headingId = createHeadingId(headingText, headingIds)
      return h(node.type, { id: headingId, key }, children)
    }
    case 'ul':
      return h('ul', { key }, children)
    case 'ol':
      return h('ol', { key }, children)
    case 'li':
      return h('li', { key }, children)
    case 'blockquote':
      return h('blockquote', { key }, children)
    case 'code': {
      const code = extractCodeText(node.children ?? [])

      return h(
        ProseCode,
        { code, key },
        {
          default: () => [h('pre', [h('code', code)])],
        },
      )
    }
    case 'link': {
      const href = sanitizeURL(node.url)
      return h(
        'a',
        {
          href,
          key,
          ...(node.newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}),
        },
        children,
      )
    }
    case 'upload':
      return renderUpload(node, key)
    default:
      return children.length > 0 ? h('p', { key }, children) : null
  }
}

const renderedNodes = computed(() => {
  const headingIds = new Map<string, number>()

  return (props.nodes ?? []).map((node, index) => renderNode(node, headingIds, index)).filter(Boolean)
})

const RenderedSlate = defineComponent({
  name: 'RenderedSlate',
  setup() {
    return () => renderedNodes.value
  },
})
</script>

<template>
  <div class="prose prose-slate w-full">
    <RenderedSlate />
  </div>
  <div
    v-if="activeImage"
    class="modal modal-open"
    role="dialog"
    aria-modal="true"
    :aria-label="activeImage.alt"
    @click.self="closeImageModal"
  >
    <div class="modal-box relative max-w-6xl bg-transparent p-0 shadow-none">
      <button
        type="button"
        class="btn btn-circle btn-sm btn-neutral absolute right-2 top-2 z-10 text-base-100"
        aria-label="Close image preview"
        @click="closeImageModal"
      >
        ✕
      </button>
      <img
        :src="activeImage.src"
        :alt="activeImage.alt"
        class="m-auto max-h-[85vh] w-fit max-w-full rounded-xl object-contain"
      >
    </div>
    <button type="button" class="modal-backdrop" aria-label="Close image preview" @click="closeImageModal" />
  </div>
</template>
