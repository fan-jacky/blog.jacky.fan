import type { GlobalConfig } from 'payload'

const About: GlobalConfig = {
  slug: 'about',
  label: 'About Page',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'body',
      type: 'richText',
      label: 'Body',
      required: true,
    },
  ],
}

export default About
