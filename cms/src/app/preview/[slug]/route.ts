import { NextResponse } from 'next/server'

type Params = {
  params: Promise<{
    slug: string
  }>
}

export async function GET(_: Request, { params }: Params) {
  const { slug } = await params
  const siteURL = process.env.PAYLOAD_PUBLIC_SITE_URL || 'http://localhost:3000'
  const previewSecret = process.env.PREVIEW_SECRET || ''

  if (!previewSecret) {
    return new NextResponse('PREVIEW_SECRET is not configured.', { status: 500 })
  }

  const url = new URL('/api/preview', siteURL)
  url.searchParams.set('secret', previewSecret)
  url.searchParams.set('slug', slug)

  return NextResponse.redirect(url)
}