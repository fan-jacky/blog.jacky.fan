import type { GlobalConfig } from 'payload'

const SiteSettings: GlobalConfig = {
  slug: 'site_settings',
  label: 'Site Settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navLinks',
      type: 'array',
      label: 'Navigation Links',
      labels: {
        singular: 'Link',
        plural: 'Links',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Label',
          required: true,
        },
        {
          name: 'linkType',
          type: 'select',
          label: 'Link Type',
          options: [
            { label: 'Internal Page', value: 'internal' },
            { label: 'External URL', value: 'external' },
          ],
          defaultValue: 'internal',
          required: true,
        },
        {
          name: 'internalPath',
          type: 'text',
          label: 'Path',
          admin: {
            description: 'e.g. /about, /articles',
            condition: (_data, siblingData) => siblingData?.linkType === 'internal',
          },
        },
        {
          name: 'externalUrl',
          type: 'text',
          label: 'URL',
          admin: {
            description: 'e.g. https://github.com/redfrogsss',
            condition: (_data, siblingData) => siblingData?.linkType === 'external',
          },
        },
      ],
    },
    {
      name: 'footerCopyright',
      type: 'text',
      label: 'Footer Copyright Text',
      defaultValue: '© 2023–2026 Jacky FAN — Hong Kong',
    },
    {
      name: 'footerLinks',
      type: 'array',
      label: 'Footer Links',
      labels: {
        singular: 'Link',
        plural: 'Links',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Label',
          required: true,
        },
        {
          name: 'linkType',
          type: 'select',
          label: 'Link Type',
          options: [
            { label: 'Internal Page', value: 'internal' },
            { label: 'External URL', value: 'external' },
          ],
          defaultValue: 'external',
          required: true,
        },
        {
          name: 'internalPath',
          type: 'text',
          label: 'Path',
          admin: {
            condition: (_data, siblingData) => siblingData?.linkType === 'internal',
          },
        },
        {
          name: 'externalUrl',
          type: 'text',
          label: 'URL',
          admin: {
            condition: (_data, siblingData) => siblingData?.linkType === 'external',
          },
        },
      ],
    },
    {
      name: 'homeAbout',
      type: 'group',
      label: 'Homepage About Section',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          defaultValue: "Hi, I'm Jacky",
        },
        {
          name: 'body',
          type: 'textarea',
          label: 'Body Text',
          defaultValue: 'A frontend developer based in Hong Kong. I write about web development, dev tooling, self-hosting, and the occasional hardware experiment.',
        },
        {
          name: 'linkText',
          type: 'text',
          label: 'Link Text',
          defaultValue: 'More about me →',
        },
        {
          name: 'linkUrl',
          type: 'text',
          label: 'Link URL',
          defaultValue: '/about',
        },
      ],
    },
  ],
}

export default SiteSettings
