import type { PayloadTocLink } from '~/types/payload'
import type { SlateLeaf, SlateNode } from '~/types/slate'

function isSlateLeaf(node: SlateNode | SlateLeaf): node is SlateLeaf {
  return typeof (node as SlateLeaf).text === 'string' && !(node as SlateNode).type
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

export function formatPayloadDate(value?: string | null) {
  return value ? new Date(value).toDateString() : ''
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