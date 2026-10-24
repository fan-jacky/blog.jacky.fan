import type { APIRoute } from 'astro'
import { fetchPayloadPostBySlug, isPayloadPreviewRequest } from '@/lib/payload'

export const prerender = false

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const GET: APIRoute = async ({ request, params }) => {
  const slug = params['slug']

  if (!slug) {
    return jsonResponse(
      { statusCode: 400, statusMessage: 'Missing slug parameter' },
      400,
    )
  }

  try {
    // Draft content is only served when the preview flag cookie is present.
    // The cookie itself is a non-sensitive flag; the secret handshake happens
    // in /api/preview.
    const draft = isPayloadPreviewRequest(request)
    const post = await fetchPayloadPostBySlug(slug, { draft })

    if (!post) {
      return jsonResponse(
        { statusCode: 404, statusMessage: 'Post not found in CMS' },
        404,
      )
    }

    return jsonResponse(post)
  } catch (error: unknown) {
    const err = error as { statusCode?: number; statusMessage?: string; message?: string }
    if (err?.statusCode === 404) {
      return jsonResponse(
        { statusCode: 404, statusMessage: 'Post not found in CMS' },
        404,
      )
    }
    console.error('[payload-post] Failed to fetch from CMS:', err?.message ?? err)
    return jsonResponse(
      {
        statusCode: 500,
        statusMessage: 'Failed to fetch post from CMS',
        message: err?.message ?? 'Failed to fetch post from CMS',
      },
      500,
    )
  }
}
