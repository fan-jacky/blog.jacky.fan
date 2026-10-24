import type { PayloadAbout, PayloadCollectionResponse, PayloadPost, PayloadPostSummary, PayloadSiteSettings } from '@/types/payload'
import { estimateContentBlocksReadTime } from '@/lib/payloadPost'

// Server-side env access: works at build time and inside server endpoints.
// Non-PUBLIC vars are read via process.env so the standalone Node runtime
// picks up runtime env (Docker) rather than only build-time values.
function serverEnv(name: string): string {
    const fromProcess = typeof process !== 'undefined' ? process.env?.[name] : undefined
    return fromProcess || (import.meta.env as Record<string, string | undefined>)[name] || ''
}

export interface PayloadConnection {
    payloadURL: string
    headers?: Record<string, string>
}

export function getPayloadConnection(): PayloadConnection {
    const payloadURL =
        serverEnv('PAYLOAD_URL') ||
        serverEnv('PUBLIC_PAYLOAD_URL') ||
        'http://localhost:4101'

    const apiKey = serverEnv('PAYLOAD_API_KEY')

    return {
        payloadURL,
        headers: apiKey ? { Authorization: `users API-Key ${apiKey}` } : undefined,
    }
}

export interface FetchPayloadPostsOptions {
    depth?: number
    draft?: boolean
    limit?: number
    onlyPublished?: boolean
    slug?: string
}

function buildPostsQuery(options: FetchPayloadPostsOptions = {}) {
    const params: Record<string, string | number> = {
        depth: options.depth ?? 0,
        draft: options.draft ? 'true' : 'false',
        sort: '-publishedDate',
    }

    if (typeof options.limit === 'number') {
        params.limit = options.limit
    }

    if (options.onlyPublished !== false) {
        params['where[status][equals]'] = 'published'
    }

    if (options.slug) {
        params['where[slug][equals]'] = options.slug
        params.limit = 1
    }

    return params
}

async function payloadFetch<T>(path: string, params: Record<string, string | number>, headers?: Record<string, string>): Promise<T> {
    const { payloadURL, headers: authHeaders } = getPayloadConnection()

    if (!payloadURL) {
        throw new Error('CMS URL is not configured')
    }

    const url = new URL(path, payloadURL)
    for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, String(value))
    }

    const response = await fetch(url, {
        headers: { ...(authHeaders ?? {}), ...(headers ?? {}) },
    })

    if (!response.ok) {
        throw new Error(`Payload request failed: ${response.status} ${response.statusText} for ${url.pathname}`)
    }

    return (await response.json()) as T
}

export async function fetchPayloadPosts(options: FetchPayloadPostsOptions = {}): Promise<PayloadPost[]> {
    const response = await payloadFetch<PayloadCollectionResponse<PayloadPost>>(
        '/api/posts',
        buildPostsQuery(options),
    )

    return response.docs
}

/**
 * Build-time variant: never throws. Static prerendering happens during
 * `astro build` (including inside the Docker image build, where the CMS
 * container may not be reachable yet) — on failure we warn and prerender
 * with an empty post list instead of failing the build. Server endpoints
 * keep using the strict fetchPayloadPosts so API errors propagate.
 */
export async function fetchPayloadPostsForBuild(options: FetchPayloadPostsOptions = {}): Promise<PayloadPost[]> {
    try {
        return await fetchPayloadPosts(options)
    } catch (error: unknown) {
        console.warn('[payload-build] Could not reach CMS at build time; prerendering with no posts:', (error as Error)?.message ?? error)
        return []
    }
}

export async function fetchPayloadPostBySlug(slug: string, options: { draft?: boolean } = {}): Promise<PayloadPost | null> {
    const isPreview = options.draft ?? false

    const [post] = await fetchPayloadPosts({
        depth: 1,
        draft: isPreview,
        onlyPublished: !isPreview,
        slug,
    })

    return post ?? null
}

export async function fetchPayloadAbout(): Promise<PayloadAbout> {
    return payloadFetch<PayloadAbout>('/api/globals/about', {})
}

export async function fetchPayloadSiteSettings(): Promise<PayloadSiteSettings> {
    return payloadFetch<PayloadSiteSettings>('/api/globals/site_settings', {})
}

export function toPayloadPostSummary(post: PayloadPost): PayloadPostSummary {
    return {
        id: post.id,
        title: post.title,
        slug: post.slug,
        description: post.description,
        author: post.author,
        publishedDate: post.publishedDate,
        tags: post.tags,
        readTime: estimateContentBlocksReadTime(post.content ?? []),
        status: post.status,
        featuredImage: post.featuredImage,
    }
}

/**
 * Read the `payload-preview` flag cookie from a Request (server endpoints).
 * The cookie is a non-sensitive flag; the secret handshake happens in /api/preview.
 */
export function isPayloadPreviewRequest(request: Request): boolean {
    const cookieHeader = request.headers.get('cookie') ?? ''
    return cookieHeader.split(/;\s*/).some((cookie) => cookie === 'payload-preview=1')
}
