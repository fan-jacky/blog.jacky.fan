import type { APIRoute } from 'astro'
import { fetchPayloadAbout } from '@/lib/payload'

export const prerender = false

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const GET: APIRoute = async () => {
  try {
    const data = await fetchPayloadAbout()
    return jsonResponse(data)
  } catch (error: unknown) {
    const err = error as { statusCode?: number; statusMessage?: string; message?: string }
    console.error('[payload-about] Failed to fetch about global from CMS:', err?.message ?? err)
    return jsonResponse(
      {
        statusCode: err?.statusCode ?? 500,
        statusMessage: err?.statusMessage ?? 'Failed to fetch about page from CMS',
        message: err?.message ?? 'Failed to fetch about page from CMS',
      },
      err?.statusCode ?? 500,
    )
  }
}
