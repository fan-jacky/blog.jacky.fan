import RSS from 'rss';  // this package does not have type
import { fetchPayloadPosts } from '~/server/utils/payload'

export default defineEventHandler(async (event) => {

    const domain = "blog.jacky.fan"
    const posts = await fetchPayloadPosts(event, {
        depth: 0,
        draft: false,
        onlyPublished: true,
    })

    const data = await new Promise(async (resolve, reject) => {
        try {
            const feed = new RSS({
                title: "Jacky FAN's Blog",
                site_url: `https://${domain}`,
                feed_url: `https://${domain}/rss.xml`
            })

            for (const post of posts) {
                feed.item({
                    title: post.title ?? '-',
                    url: `https://${domain}/articles/${post.slug}`,
                    date: post.publishedDate,
                    pubDate: post.publishedDate,
                    description: post.description
                })
            }

            resolve(feed.xml({indent: true}))

        } catch (error) {
            reject(error);
        }
    })

    setResponseHeaders(event, { "content-type": "text/xml" });
    return data;
});
