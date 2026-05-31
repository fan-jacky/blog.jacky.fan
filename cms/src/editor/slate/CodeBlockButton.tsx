// @ts-nocheck
'use client'

import React from 'react'
import { ElementButton } from '@payloadcms/richtext-slate/client'

type Props = {
  format: string
}

export const CodeBlockButton = ({ format }: Props) => (
  <ElementButton format={format} tooltip="Code block">
    {'</>'}
  </ElementButton>
)