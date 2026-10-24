import type { APIRoute } from 'astro'
import type { PayloadPost } from '@/types/payload'
import { fetchPayloadPosts } from '@/lib/payload'

export const prerender = false

const DOMAIN = 'blog.jacky.fan'

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export const GET: APIRoute = async () => {
  let posts: PayloadPost[] = []

  try {
    posts = await fetchPayloadPosts({
      depth: 0,
      draft: false,
      onlyPublished: true,
    })
  } catch (error) {
    console.warn('[sitemap] Falling back to static routes because CMS posts could not be fetched.', error)
  }

  const entries = [
    { url: '/', changefreq: 'weekly' },
    ...posts.map((post) => ({ url: `/articles/${post.slug}`, changefreq: 'monthly' })),
  ]

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map((entry) => [
      '  <url>',
      `    <loc>https://${DOMAIN}${escapeXml(entry.url)}</loc>`,
      `    <changefreq>${entry.changefreq}</changefreq>`,
      '  </url>',
    ].join('\n')),
    '</urlset>',
  ].join('\n')

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  })
}
