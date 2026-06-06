import type { Block } from 'payload'

export const CodeBlock: Block = {
  slug: 'codeBlock',
  labels: {
    singular: 'Code Block',
    plural: 'Code Blocks',
  },
  fields: [
    {
      name: 'language',
      type: 'text',
      label: 'Language',
      admin: {
        description: 'Language used for syntax highlighting, for example: ts, js, bash, json.',
      },
    },
    {
      name: 'showLineNumbers',
      type: 'checkbox',
      label: 'Show line numbers',
      defaultValue: true,
    },
    {
      name: 'code',
      type: 'textarea',
      label: 'Code',
      required: true,
      admin: {
        rows: 16,
      },
    },
  ],
}