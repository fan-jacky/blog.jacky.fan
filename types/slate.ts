/**
 * Shared types for Payload CMS Slate rich text content.
 */

export interface SlateLeaf {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  code?: boolean
}

export interface SlateNode {
  type?: string
  children?: Array<SlateNode | SlateLeaf>
  url?: string
  newTab?: boolean
  // Leaf properties (for inline nodes)
  text?: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  code?: boolean
}
