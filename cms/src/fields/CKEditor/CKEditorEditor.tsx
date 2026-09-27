import React, { useEffect, useRef } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Heading,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Subscript,
  Superscript,
  Link,
  BlockQuote,
  CodeBlock,
  List,
  Indent,
  Table,
  TableToolbar,
  HorizontalLine,
  RemoveFormat,
  PasteFromOffice,
  PasteFromMarkdownExperimental,
  Autoformat,
  FindAndReplace,
} from 'ckeditor5'
import 'ckeditor5/ckeditor5.css'

export type CKEditorEditorProps = {
  value?: string
  onChange?: (data: string) => void
  disabled?: boolean
}

const CKEditorEditor: React.FC<CKEditorEditorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const editorInstanceRef = useRef<ClassicEditor | null>(null)

  // No manual change listener here: the <CKEditor onChange={...}> prop below
  // already fires on every `change:data` event, so registering another one
  // would run the change handler (and any state update) twice per keystroke.
  const handleReady = (editor: ClassicEditor) => {
    editorInstanceRef.current = editor
  }

  useEffect(() => {
    return () => {
      editorInstanceRef.current = null
    }
  }, [])

  return (
    <div className="ck-editor-field__editor">
      <CKEditor
        editor={ClassicEditor}
        data={typeof value === 'string' ? value : ''}
        disabled={disabled}
        config={{
          licenseKey: 'GPL',
          plugins: [
            Essentials,
            Paragraph,
            Heading,
            Bold,
            Italic,
            Underline,
            Strikethrough,
            Code,
            Subscript,
            Superscript,
            Link,
            BlockQuote,
            CodeBlock,
            List,
            Indent,
            Table,
            TableToolbar,
            HorizontalLine,
            RemoveFormat,
            PasteFromOffice,
            PasteFromMarkdownExperimental,
            Autoformat,
            FindAndReplace,
          ],
          toolbar: {
            items: [
              'heading',
              '|',
              'bold',
              'italic',
              'underline',
              'strikethrough',
              'code',
              'superscript',
              'subscript',
              '|',
              'link',
              'blockQuote',
              'codeBlock',
              'insertTable',
              'horizontalLine',
              '|',
              'bulletedList',
              'numberedList',
              'outdent',
              'indent',
              '|',
              'removeFormat',
              '|',
              'findAndReplace',
            ],
            shouldNotGroupWhenFull: false,
          },
          heading: {
            options: [
              { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
              { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
              { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
              { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
              { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
            ],
          },
          table: {
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
          },
        }}
        onReady={handleReady}
        onChange={(_event, editor) => {
          onChange?.(editor.getData())
        }}
      />
    </div>
  )
}

export default CKEditorEditor
