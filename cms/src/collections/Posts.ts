import type { CollectionConfig } from 'payload'

const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'status', 'publishedDate'],
    livePreview: {
      url: ({ data, req }) => {
        if (typeof data?.slug !== 'string' || !data.slug.trim()) {
          return null
        }

        const siteURL = process.env.PAYLOAD_PUBLIC_SITE_URL || 'http://localhost:3000'
        const previewSecret = process.env.PREVIEW_SECRET || ''

        if (!previewSecret) {
          req.payload.logger.warn('Posts live preview is disabled because PREVIEW_SECRET is not configured.')
          return null
        }

        const previewURL = new URL('/api/preview', siteURL)
        previewURL.searchParams.set('secret', previewSecret)
        previewURL.searchParams.set('slug', data.slug)

        return previewURL.toString()
      },
    },
    preview: (doc) => {
      if (typeof doc?.slug === 'string') {
        return `/preview/${encodeURIComponent(doc.slug)}`
      }
      return null
    },
  },
  versions: {
    drafts: {
      autosave: true,
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Title',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      admin: {
        position: 'sidebar',
        description: 'URL-friendly identifier (e.g. my-first-post)',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'draft',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedDate',
      type: 'date',
      label: 'Published Date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'author',
      type: 'text',
      label: 'Author',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Excerpt / Description',
      admin: {
        description: 'A short summary shown on the article list page.',
      },
    },
    {
      name: 'tags',
      type: 'text',
      label: 'Tags',
      admin: {
        description: 'Comma-separated list of tags (e.g. Nuxt, TypeScript)',
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Content',
      required: true,
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Featured Image',
    },
  ],
}

export default Posts
