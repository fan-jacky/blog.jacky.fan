import { SitemapStream, streamToPromise } from 'sitemap'
import { fetchPayloadPosts } from '~/server/utils/payload'

export default defineEventHandler(async (event) => {
  const posts = await fetchPayloadPosts(event, {
    depth: 0,
    draft: false,
    onlyPublished: true,
  })

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
