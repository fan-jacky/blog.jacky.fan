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

function toRfc822Date(value?: string | null): string | null {
  if (!value) {
    return null
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date.toUTCString()
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
    console.warn('[rss] Falling back to an empty feed because CMS posts could not be fetched.', error)
  }

  const items = posts.map((post) => {
    const lines = [
      '    <item>',
      `      <title>${escapeXml(post.title ?? '-')}</title>`,
      `      <description>${escapeXml(post.description ?? '')}</description>`,
      `      <link>https://${DOMAIN}/articles/${post.slug}</link>`,
      `      <guid isPermaLink="true">https://${DOMAIN}/articles/${post.slug}</guid>`,
    ]

    const pubDate = toRfc822Date(post.publishedDate ?? null)
    if (pubDate) {
      lines.push(`      <pubDate>${pubDate}</pubDate>`)
    }

    lines.push('    </item>')

    return lines.join('\n')
  })

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">',
    '<channel>',
    `  <title>Jacky FAN's Blog</title>`,
    `  <atom:link href="https://${DOMAIN}/rss.xml" rel="self" type="application/rss+xml"/>`,
    `  <link>https://${DOMAIN}</link>`,
    `  <description>RSS feed for Jacky FAN's Blog.</description>`,
    `  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
    '  <generator>rss</generator>',
    ...items,
    '</channel>',
    '</rss>',
  ].join('\n')

  return new Response(xml, {
    headers: { 'Content-Type': 'text/xml' },
  })
}
