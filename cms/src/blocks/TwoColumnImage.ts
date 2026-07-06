import type { Block } from 'payload'

export const TwoColumnImage: Block = {
  slug: 'twoColumnImage',
  labels: {
    singular: 'Two-Column Image',
    plural: 'Two-Column Images',
  },
  fields: [
    {
      name: 'leftImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Left Image / Video',
      required: true,
      admin: {
        description: 'Supports images (PNG, JPG, SVG) and WebM videos.',
      },
    },
    {
      name: 'leftCaption',
      type: 'text',
      label: 'Left Caption',
      admin: {
        description: 'Optional caption shown below the left image.',
      },
    },
    {
      name: 'rightImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Right Image / Video',
      required: false,
      admin: {
        description: 'Optional. If left empty, the left image spans full width.',
      },
    },
    {
      name: 'rightCaption',
      type: 'text',
      label: 'Right Caption',
      admin: {
        description: 'Optional caption shown below the right image.',
      },
    },
  ],
}
