'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import type { TextareaField } from 'payload'
import { useField } from '@payloadcms/ui'

const CKEditorEditor = dynamic(() => import('./CKEditorEditor'), { ssr: false })

type CKEditorFieldProps = {
  path: string
  field: TextareaField
  readOnly?: boolean
}

export const CKEditorField: React.FC<CKEditorFieldProps> = ({ path, readOnly }) => {
  const { value, setValue } = useField<string>({ path })

  const currentValue = typeof value === 'string' ? value : ''

  const handleChange = React.useCallback(
    (data: string) => {
      setValue(data)
    },
    [setValue],
  )

  return (
    <CKEditorEditor
      value={currentValue}
      onChange={handleChange}
      disabled={Boolean(readOnly)}
    />
  )
}

export default CKEditorField
