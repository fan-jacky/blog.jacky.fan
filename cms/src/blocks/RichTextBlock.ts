import type { Block } from 'payload'

export const RichTextBlock: Block = {
  slug: 'richText',
  labels: {
    singular: 'Rich Text',
    plural: 'Rich Text',
  },
  fields: [
    {
      name: 'body',
      type: 'richText',
      label: 'Body',
      required: true,
    },
  ],
}