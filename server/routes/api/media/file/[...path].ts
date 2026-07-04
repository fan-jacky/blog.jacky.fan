export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path') || ''

  // Forward the request to the internal CMS
  const target = `http://cms:4201/api/media/file/${path}`

  const response = await fetch(target)

  // Forward the response headers
  const resHeaders: Record<string, string> = {}
  response.headers.forEach((value, key) => {
    resHeaders[key] = value
  })

  // Add caching for successful responses
  if (response.ok) {
    resHeaders['cache-control'] = 'public, max-age=31536000, immutable'
  }

  setResponseHeaders(event, resHeaders)
  setResponseStatus(event, response.status)

  // Return the raw body — Nitro handles Buffer/Uint8Array as binary
  const blob = await response.arrayBuffer()
  return new Uint8Array(blob)
})
