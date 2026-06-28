import { SitemapStream, streamToPromise } from 'sitemap'
import type { PayloadPost } from '~/types/payload'
import { fetchPayloadPosts } from '~/server/utils/payload'

export default defineEventHandler(async (event) => {
  let posts: PayloadPost[] = []

  try {
    posts = await fetchPayloadPosts(event, {
      depth: 0,
      draft: false,
      onlyPublished: true,
    })
  } catch (error) {
    console.warn('[sitemap] Falling back to static routes because CMS posts could not be fetched.', error)
  }

  const sitemap = new SitemapStream({
      hostname: "https://blog.jacky.fan",
  });

  sitemap.write({
    url: '/',
    changefreq: 'weekly',
  })

  for (const post of posts) {
    sitemap.write({
      url: `/articles/${post.slug}`,
      changefreq: 'monthly'
    })
  }
  sitemap.end()

  return streamToPromise(sitemap)
})
