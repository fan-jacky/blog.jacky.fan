export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') || ''

  // Forward the request to the internal CMS
  const target = `http://cms:4201/api/globals/${slug}`

  const response = await fetch(target)

  const resHeaders: Record<string, string> = {}
  response.headers.forEach((value, key) => {
    // Skip hop-by-hop headers
    if (!['transfer-encoding', 'connection'].includes(key.toLowerCase())) {
      resHeaders[key] = value
    }
  })

  setResponseHeaders(event, resHeaders)
  setResponseStatus(event, response.status)

  // Return JSON body
  return await response.json()
})
