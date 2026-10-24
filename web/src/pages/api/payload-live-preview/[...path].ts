import type { APIRoute } from 'astro'
import { getPayloadConnection } from '@/lib/payload'

export const prerender = false

function errorResponse(statusCode: number, statusMessage: string, data?: unknown): Response {
  return new Response(
    JSON.stringify({ statusCode, statusMessage, data }),
    {
      status: statusCode,
      headers: { 'Content-Type': 'application/json' },
    },
  )
}

// POST proxy to the CMS, mirroring the Payload live-preview contract:
// the request is forwarded as a POST carrying an
// `X-Payload-HTTP-Method-Override: GET` header so the CMS treats it as a read.
export const POST: APIRoute = async ({ params, request }) => {
  const path = params['path']

  if (!path) {
    return errorResponse(400, 'Missing Payload API path')
  }

  const { payloadURL, headers } = getPayloadConnection()

  if (!payloadURL) {
    return errorResponse(500, 'CMS URL is not configured')
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    body = undefined
  }

  try {
    const response = await fetch(`${payloadURL}/api/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Payload-HTTP-Method-Override': 'GET',
        ...(headers ?? {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    })

    const text = await response.text()

    let data: unknown = text
    let isJson = false
    try {
      data = JSON.parse(text) as unknown
      isJson = true
    } catch {
      // Non-JSON upstream response — proxy the raw text instead.
    }

    if (!response.ok) {
      // Mirror $fetch semantics: surface the upstream status and its body as `data`.
      return errorResponse(response.status, 'Failed to fetch live preview document', data)
    }

    if (!isJson) {
      return new Response(text, {
        status: 200,
        headers: { 'Content-Type': response.headers.get('content-type') ?? 'text/plain' },
      })
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: unknown) {
    const err = error as { data?: unknown; message?: string; statusCode?: number; statusMessage?: string }
    return errorResponse(
      err?.statusCode ?? 500,
      err?.statusMessage ?? 'Failed to fetch live preview document',
      err?.data,
    )
  }
}
