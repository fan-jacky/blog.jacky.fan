import { fetchPayloadPosts, toPayloadPostSummary } from '~/server/utils/payload'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const limit = typeof query.limit === 'string' ? Number.parseInt(query.limit, 10) : undefined

    const posts = await fetchPayloadPosts(event, {
      depth: 0,
      limit: Number.isFinite(limit) ? limit : undefined,
    })

    return posts.map(toPayloadPostSummary)
  } catch (error: unknown) {
    const err = error as { statusCode?: number; statusMessage?: string; message?: string }
    console.error('[payload-posts] Failed to fetch posts from CMS:', err?.message ?? err)
    throw createError({
      statusCode: err?.statusCode ?? 500,
      statusMessage: err?.statusMessage ?? 'Failed to fetch posts from CMS',
    })
  }
})
