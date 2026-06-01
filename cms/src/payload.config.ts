import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import sharp from 'sharp'
import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { slateEditor } from '@payloadcms/richtext-slate'
import Posts from './collections/Posts'
import Media from './collections/Media'
import Users from './collections/Users'
import { codeBlock } from './editor/slate/codeBlock'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

dotenv.config({ path: path.resolve(dirname, '../.env') })

function parseAllowedOrigins(...values: Array<string | undefined>) {
  return values
    .flatMap((value) => (value || '').split(','))
    .map((value) => value.trim())
    .filter(Boolean)
    .filter((value, index, all) => all.indexOf(value) === index)
}

const allowedOrigins = parseAllowedOrigins(
  process.env.PAYLOAD_PUBLIC_SITE_URL,
  process.env.PAYLOAD_PUBLIC_SITE_URLS,
  process.env.PAYLOAD_PUBLIC_SERVER_URL,
)

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3001',
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— Blog CMS',
      icons: {
        icon: '/favicon.ico',
      },
      openGraph: {
        images: [{ url: '/og-image.jpg' }],
      },
    },
  },
  editor: slateEditor({
    admin: {
      elements: [
        'blockquote',
        codeBlock,
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'indent',
        'li',
        'link',
        'ol',
        'relationship',
        'textAlign',
        'ul',
        'upload',
      ],
    },
  }),
  collections: [Posts, Media, Users],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || 'mongodb://localhost:27017/blog-cms',
  }),
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(dirname, 'generated-schema.graphql'),
  },
  cors: allowedOrigins.length > 0
    ? allowedOrigins
    : ['http://localhost:3000', 'http://localhost:3001'],
  csrf: allowedOrigins.length > 0
    ? allowedOrigins
    : ['http://localhost:3000', 'http://localhost:3001'],
  upload: {
    limits: {
      fileSize: 10000000, // 10 MB
    },
  },
})
