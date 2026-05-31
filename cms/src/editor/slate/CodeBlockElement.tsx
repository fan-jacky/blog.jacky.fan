'use client'

import React from 'react'
import { useElement } from '@payloadcms/richtext-slate/client'

export const CodeBlockElement = () => {
  const { attributes, children } = useElement()

  return (
    <pre
      {...attributes}
      style={{
        backgroundColor: '#111827',
        borderRadius: '0.5rem',
        color: '#f9fafb',
        margin: '0 0 1rem',
        overflowX: 'auto',
        padding: '1rem',
      }}
    >
      <code>{children}</code>
    </pre>
  )
}