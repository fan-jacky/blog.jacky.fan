import type { APIRoute } from 'astro'

export const prerender = false

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const GET: APIRoute = async ({ cookies, redirect, url }) => {
  const secret = url.searchParams.get('secret')
  const slug = url.searchParams.get('slug')

  const previewSecret =
    (typeof process !== 'undefined' ? process.env?.PREVIEW_SECRET : undefined) ||
    import.meta.env.PREVIEW_SECRET ||
    ''

  if (!secret || secret !== previewSecret) {
    return jsonResponse(
      { statusCode: 401, statusMessage: 'Invalid preview secret' },
      401,
    )
  }

  if (!slug) {
    return jsonResponse(
      { statusCode: 400, statusMessage: 'Missing or invalid slug parameter' },
      400,
    )
  }

  // httpOnly is intentionally false so the PreviewBar can detect preview mode
  // on the client side. The cookie value carries no sensitive data — it is
  // merely a flag. The actual secret is validated above.
  cookies.set('payload-preview', '1', {
    httpOnly: false,
    path: '/',
    maxAge: 60 * 60, // 1 hour
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  })

  return redirect(`/cms-preview/${slug}`, 302)
}
