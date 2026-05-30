import type { H3Event } from 'h3'
import type { PayloadCollectionResponse, PayloadPost, PayloadPostSummary } from '~/types/payload'

interface FetchPayloadPostsOptions {
  depth?: number
  draft?: boolean
  limit?: number
  onlyPublished?: boolean
  slug?: string
}

function getPayloadHeaders() {
  const config = useRuntimeConfig()

  return {
    payloadURL: config.payloadUrl,
    headers: config.payloadApiKey
      ? { Authorization: `users API-Key ${config.payloadApiKey}` }
      : undefined,
  }
}

function buildPostsQuery(options: FetchPayloadPostsOptions = {}) {
  const params: Record<string, string | number> = {
    depth: options.depth ?? 0,
    draft: options.draft ? 'true' : 'false',
    sort: '-publishedDate',
  }

  if (typeof options.limit === 'number') {
    params.limit = options.limit
  }

  if (options.onlyPublished !== false) {
    params['where[status][equals]'] = 'published'
  }

  if (options.slug) {
    params['where[slug][equals]'] = options.slug
    params.limit = 1
  }

  return params
}

export function isPayloadPreviewRequest(event: H3Event) {
  const cookies = parseCookies(event)
  return !!cookies['payload-preview']
}

export async function fetchPayloadPosts(
  event: H3Event,
  options: FetchPayloadPostsOptions = {}
) {
  const { payloadURL, headers } = getPayloadHeaders()

  if (!payloadURL) {
    throw createError({ statusCode: 500, statusMessage: 'CMS URL is not configured' })
  }

  const response = await $fetch<PayloadCollectionResponse<PayloadPost>>(
    `${payloadURL}/api/posts`,
    {
      params: buildPostsQuery(options),
      headers,
    }
  )

  return response.docs
}

export async function fetchPayloadPostBySlug(event: H3Event, slug: string) {
  const [post] = await fetchPayloadPosts(event, {
    depth: 1,
    draft: isPayloadPreviewRequest(event),
    slug,
  })

  return post ?? null
}

export function toPayloadPostSummary(post: PayloadPost): PayloadPostSummary {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    description: post.description,
    author: post.author,
    publishedDate: post.publishedDate,
    status: post.status,
  }
}
