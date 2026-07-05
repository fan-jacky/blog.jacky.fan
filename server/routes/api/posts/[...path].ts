export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path') || ''

  // Build CMS target URL preserving query params
  const queryString = getQuery(event)
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(queryString)) {
    if (value !== undefined && value !== null) {
      params.append(key, String(value))
    }
  }
  const qs = params.toString()
  const target = `http://cms:4201/api/posts/${path}${qs ? `?${qs}` : ''}`

  const response = await fetch(target)

  const resHeaders: Record<string, string> = {}
  response.headers.forEach((value, key) => {
    if (!['transfer-encoding', 'connection'].includes(key.toLowerCase())) {
      resHeaders[key] = value
    }
  })

  setResponseHeaders(event, resHeaders)
  setResponseStatus(event, response.status)

  return await response.json()
})
