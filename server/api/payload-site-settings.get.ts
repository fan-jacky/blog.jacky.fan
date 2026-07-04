import type { PayloadSiteSettings } from '~/types/payload'
import { getPayloadConnection } from '~/server/utils/payload'

export default defineEventHandler(async (event) => {
  try {
    const { payloadURL, headers } = getPayloadConnection()

    if (!payloadURL) {
      throw createError({ statusCode: 500, statusMessage: 'CMS URL is not configured' })
    }

    const data = await $fetch<PayloadSiteSettings>(`${payloadURL}/api/globals/site_settings`, {
      headers,
    })

    return data
  } catch (error: unknown) {
    const err = error as { statusCode?: number; statusMessage?: string; message?: string }
    console.error('[payload-site-settings] Failed to fetch site settings from CMS:', err?.message ?? err)
    throw createError({
      statusCode: err?.statusCode ?? 500,
      statusMessage: err?.statusMessage ?? 'Failed to fetch site settings from CMS',
    })
  }
})
