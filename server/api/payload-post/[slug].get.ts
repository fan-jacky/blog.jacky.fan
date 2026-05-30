import { fetchPayloadPostBySlug } from '~/server/utils/payload'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Missing slug parameter' })
  }

  try {
    const post = await fetchPayloadPostBySlug(event, slug)

    if (!post) {
      throw createError({ statusCode: 404, statusMessage: 'Post not found in CMS' })
    }

    return post
  } catch (error: unknown) {
    const err = error as { statusCode?: number; statusMessage?: string; message?: string }
    if (err?.statusCode === 404) throw error
    console.error('[payload-post] Failed to fetch from CMS:', err?.message ?? err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch post from CMS',
    })
  }
})
