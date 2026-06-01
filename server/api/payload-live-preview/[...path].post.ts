import { getPayloadConnection } from '~/server/utils/payload'

export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path')

  if (!path) {
    throw createError({ statusCode: 400, statusMessage: 'Missing Payload API path' })
  }

  const { payloadURL, headers } = getPayloadConnection()

  if (!payloadURL) {
    throw createError({ statusCode: 500, statusMessage: 'CMS URL is not configured' })
  }

  const body = await readBody(event)

  try {
    return await $fetch(`${payloadURL}/api/${path}`, {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
        'X-Payload-HTTP-Method-Override': 'GET',
        ...(headers || {}),
      },
    })
  } catch (error: unknown) {
    const err = error as { data?: unknown; message?: string; statusCode?: number; statusMessage?: string }

    throw createError({
      statusCode: err.statusCode ?? 500,
      statusMessage: err.statusMessage ?? 'Failed to fetch live preview document',
      data: err.data,
    })
  }
})