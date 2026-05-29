export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const cookies = parseCookies(event)
  const isPreview = !!cookies['payload-preview']

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Missing slug parameter' })
  }

  const config = useRuntimeConfig()
  const payloadURL = config.payloadUrl
  const apiKey = config.payloadApiKey

  if (!payloadURL) {
    throw createError({ statusCode: 500, statusMessage: 'CMS URL is not configured' })
  }

  try {
    const response = await $fetch<{ docs: unknown[] }>(
      `${payloadURL}/api/posts`,
      {
        params: {
          'where[slug][equals]': slug,
          draft: isPreview ? 'true' : 'false',
          depth: 1,
          limit: 1,
        },
        headers: apiKey
          ? { Authorization: `users API-Key ${apiKey}` }
          : {},
      }
    )

    if (!response.docs || response.docs.length === 0) {
      throw createError({ statusCode: 404, statusMessage: 'Post not found in CMS' })
    }

    return response.docs[0]
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
