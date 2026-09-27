import type { Block } from 'payload'

export const CKRichTextBlock: Block = {
  slug: 'ckRichText',
  labels: {
    singular: 'CK Rich Text',
    plural: 'CK Rich Text',
  },
  fields: [
    {
      name: 'body',
      type: 'textarea',
      label: 'Body (HTML)',
      required: true,
      admin: {
        components: {
          Field: '/src/fields/CKEditor/index.tsx#CKEditorField',
        },
        description:
          'Rich text edited with CKEditor 5. Markdown pasted from the clipboard is automatically converted to rich text. Stored as HTML.',
      },
    },
  ],
}
