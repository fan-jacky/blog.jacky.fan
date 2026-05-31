import type { RichTextCustomElement } from '@payloadcms/richtext-slate'

const name = 'code'

export const codeBlock: RichTextCustomElement = {
  name,
  Button: {
    clientProps: {
      format: name,
    },
    path: '/src/editor/slate/CodeBlockButton.tsx#CodeBlockButton',
  },
  Element: '/src/editor/slate/CodeBlockElement.tsx#CodeBlockElement',
}