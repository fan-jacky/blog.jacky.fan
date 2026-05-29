export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const { secret, slug } = query

  if (!secret || secret !== config.previewSecret) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid preview secret' })
  }

  if (!slug || typeof slug !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'Missing or invalid slug parameter' })
  }

  // httpOnly is intentionally false so the PreviewBar component can detect
  // preview mode on the client side. The cookie value carries no sensitive
  // data — it is merely a flag. The actual secret is validated above.
  setCookie(event, 'payload-preview', '1', {
    httpOnly: false,
    path: '/',
    maxAge: 60 * 60, // 1 hour
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  })

  return sendRedirect(event, `/cms-preview/${slug}`)
})
