import type { APIRoute } from 'astro'
import { fetchPayloadPosts, toPayloadPostSummary } from '@/lib/payload'

export const prerender = false

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const GET: APIRoute = async ({ request }) => {
  try {
    const limitParam = new URL(request.url).searchParams.get('limit')
    const limit = typeof limitParam === 'string' ? Number.parseInt(limitParam, 10) : undefined

    const posts = await fetchPayloadPosts({
      depth: 1,
      limit: Number.isFinite(limit) ? limit : undefined,
    })

    return jsonResponse(posts.map(toPayloadPostSummary))
  } catch (error: unknown) {
    const err = error as { statusCode?: number; statusMessage?: string; message?: string }
    console.error('[payload-posts] Failed to fetch posts from CMS:', err?.message ?? err)
    return jsonResponse(
      {
        statusCode: err?.statusCode ?? 500,
        statusMessage: err?.statusMessage ?? 'Failed to fetch posts from CMS',
        message: err?.message ?? 'Failed to fetch posts from CMS',
      },
      err?.statusCode ?? 500,
    )
  }
}
