import type { SlateNode } from '~/types/slate'

export interface PayloadMedia {
  url?: string | null
  alt?: string | null
}

export interface PayloadPost {
  id: number | string
  title: string
  slug: string
  description?: string | null
  content?: PayloadContentBlock[]
  author?: string | null
  publishedDate?: string | null
  tags?: string | null
  status: 'draft' | 'published'
  featuredImage?: PayloadMedia | number | string | null
}

interface PayloadContentBlockBase {
  id?: string | null
  blockName?: string | null
}

export interface PayloadRichTextBlock extends PayloadContentBlockBase {
  blockType: 'richText'
  body?: SlateNode[]
}

export interface PayloadCodeBlock extends PayloadContentBlockBase {
  blockType: 'codeBlock'
  code: string
  language?: string | null
  showLineNumbers?: boolean | null
}

export type PayloadContentBlock = PayloadRichTextBlock | PayloadCodeBlock

export interface PayloadPostSummary {
  id: number | string
  title: string
  slug: string
  description?: string | null
  author?: string | null
  publishedDate?: string | null
  status: 'draft' | 'published'
}

export interface PayloadTocLink {
  id: string
  text: string
  depth: number
}

export interface PayloadCollectionResponse<T> {
  docs: T[]
}
