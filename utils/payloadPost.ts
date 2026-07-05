import type { PayloadContentBlock, PayloadTocLink } from '~/types/payload'
import type { SlateLeaf, SlateNode } from '~/types/slate'

function isSlateLeaf(node: SlateNode | SlateLeaf): node is SlateLeaf {
  return typeof (node as SlateLeaf).text === 'string' && !(node as SlateNode).type
}

function isRichTextBlock(block: PayloadContentBlock): block is Extract<PayloadContentBlock, { blockType: 'richText' }> {
  return block.blockType === 'richText'
}

function isCodeBlock(block: PayloadContentBlock): block is Extract<PayloadContentBlock, { blockType: 'codeBlock' }> {
  return block.blockType === 'codeBlock'
}

export function normalizePayloadSlug(slug: string | string[] | undefined) {
  if (Array.isArray(slug)) {
    return slug.join('/').trim()
  }

  return typeof slug === 'string' ? slug.trim() : ''
}

export function buildArticlePath(slug: string) {
  return `/articles/${slug}`
}

export function resolvePayloadMediaUrl(
  image: { url?: string | null } | number | string | null | undefined,
  runtimeConfig: ReturnType<typeof useRuntimeConfig>,
) {
  if (!image || typeof image !== 'object' || !image.url) {
    return ''
  }

  try {
    return new URL(image.url).toString()
  } catch {
    const base = runtimeConfig.public.payloadUrl || runtimeConfig.payloadUrl || ''

    if (!base) {
      return image.url
    }

    try {
      return new URL(image.url, base).toString()
    } catch {
      return image.url
    }
  }
}

export function resolvePayloadMediaAlt(
  title: string,
  image: { alt?: string | null } | number | string | null | undefined,
) {
  if (image && typeof image === 'object' && image.alt?.trim()) {
    return image.alt
  }

  return `${title} featured image`
}

export function parsePayloadTags(tags?: string | null) {
  return (tags ?? '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
}

export function getPrimaryPayloadTag(tags?: string | null) {
  return parsePayloadTags(tags)[0] ?? ''
}

export function extractTextFromSlate(nodes: Array<SlateNode | SlateLeaf> = []): string {
  return nodes
    .map((node) => {
      if (isSlateLeaf(node)) {
        return node.text
      }

      if (Array.isArray(node.children)) {
        return extractTextFromSlate(node.children)
      }

      return ''
    })
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function estimateReadTime(nodes: SlateNode[] = []) {
  const wordCount = extractTextFromSlate(nodes).split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(wordCount / 250))
}

export function extractTextFromContentBlocks(blocks: PayloadContentBlock[] = []): string {
  return blocks
    .map((block) => {
      if (isRichTextBlock(block)) {
        return extractTextFromSlate(block.body ?? [])
      }

      if (isCodeBlock(block)) {
        return block.code ?? ''
      }

      return ''
    })
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function estimateContentBlocksReadTime(blocks: PayloadContentBlock[] = []) {
  const wordCount = extractTextFromContentBlocks(blocks).split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(wordCount / 250))
}

export function formatPayloadDate(value?: string | null) {
  if (!value) {
    return ''
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return new Intl.DateTimeFormat('en', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function createHeadingId(text: string, duplicates: Map<string, number>) {
  const base = text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-') || 'section'

  const count = duplicates.get(base) ?? 0
  duplicates.set(base, count + 1)

  return count === 0 ? base : `${base}-${count + 1}`
}

export function extractTableOfContents(nodes: SlateNode[] = []) {
  const links: PayloadTocLink[] = []
  const duplicates = new Map<string, number>()

  const visit = (node: SlateNode) => {
    const headingLevel = typeof node.type === 'string' && /^h[1-6]$/.test(node.type)
      ? Number.parseInt(node.type.slice(1), 10)
      : null

    if (headingLevel) {
      const text = extractTextFromSlate(node.children ?? []).trim()

      if (text) {
        links.push({
          id: createHeadingId(text, duplicates),
          text,
          depth: headingLevel,
        })
      }
    }

    for (const child of node.children ?? []) {
      if (!isSlateLeaf(child)) {
        visit(child)
      }
    }
  }

  for (const node of nodes) {
    visit(node)
  }

  return links
}

export function extractContentBlocksTableOfContents(blocks: PayloadContentBlock[] = []) {
  return blocks
    .filter(isRichTextBlock)
    .flatMap((block) => extractTableOfContents(block.body ?? []))
}