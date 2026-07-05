import type { SlateNode } from '~/types/slate'

export interface PayloadMedia {
  id?: string | number | null
  url?: string | null
  alt?: string | null
  filename?: string | null
  mimeType?: string | null
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

export interface PayloadTwoColumnImageBlock extends PayloadContentBlockBase {
  blockType: 'twoColumnImage'
  leftImage: PayloadMedia
  rightImage?: PayloadMedia | null
  caption?: string | null
}

export type PayloadContentBlock = PayloadRichTextBlock | PayloadCodeBlock | PayloadTwoColumnImageBlock

export interface PayloadPostSummary {
  id: number | string
  title: string
  slug: string
  description?: string | null
  author?: string | null
  publishedDate?: string | null
  tags?: string | null
  readTime?: number
  status: 'draft' | 'published'
  featuredImage?: PayloadMedia | number | string | null
}

export interface PayloadTocLink {
  id: string
  text: string
  depth: number
}

export interface PayloadAbout {
  body?: SlateNode[]
}

export interface SiteLink {
  id?: string | null
  label: string
  linkType: 'internal' | 'external'
  internalPath?: string | null
  externalUrl?: string | null
}

export interface PayloadSiteSettings {
  navLinks?: SiteLink[] | null
  footerCopyright?: string | null
  footerLinks?: SiteLink[] | null
  homeAbout?: {
    title?: string | null
    body?: string | null
    linkText?: string | null
    linkUrl?: string | null
  } | null
}

export interface PayloadCollectionResponse<T> {
  docs: T[]
}
