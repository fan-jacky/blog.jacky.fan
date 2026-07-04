export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path') || ''
  const query = getQuery(event)

  // Forward the request to the internal CMS
  const target = `http://cms:4201/api/media/file/${path}`

  try {
    const response = await fetch(target)

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: 'Media not found',
      })
    }

    // Forward the response headers and body
    const headers: Record<string, string> = {}
    response.headers.forEach((value, key) => {
      headers[key] = value
    })

    // Set caching headers
    headers['cache-control'] = 'public, max-age=31536000, immutable'

    setResponseHeaders(event, headers)

    const blob = await response.arrayBuffer()
    return new Uint8Array(blob)
  } catch (error) {
    console.error('[media-proxy] Failed to proxy media:', error)
    throw createError({
      statusCode: 502,
      statusMessage: 'Failed to fetch media from CMS',
    })
  }
})
