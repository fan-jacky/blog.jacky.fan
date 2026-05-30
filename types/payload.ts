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
  content?: SlateNode[]
  author?: string | null
  publishedDate?: string | null
  tags?: string | null
  status: 'draft' | 'published'
  featuredImage?: PayloadMedia | number | string | null
}

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
