import express from 'express'
import payload from 'payload'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: path.resolve(__dirname, '../.env') })

if (!process.env.PAYLOAD_SECRET) {
  throw new Error('PAYLOAD_SECRET environment variable is required but not set.')
}

const app = express()

// Redirect root to Admin panel
app.get('/', (_, res) => {
  res.redirect('/admin')
})

app.get('/preview/:slug', (req, res) => {
  const siteURL = process.env.PAYLOAD_PUBLIC_SITE_URL || 'http://localhost:3000'
  const previewSecret = process.env.PREVIEW_SECRET || ''
  const { slug } = req.params

  if (!previewSecret) {
    return res.status(500).send('PREVIEW_SECRET is not configured.')
  }

  const params = new URLSearchParams({
    secret: previewSecret,
    slug,
  })

  res.redirect(`${siteURL}/api/preview?${params.toString()}`)
})

const start = async (): Promise<void> => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET as string,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
    },
  })

  const PORT = parseInt(process.env.PORT || '3001', 10)
  app.listen(PORT, () => {
    payload.logger.info(`Server started on port ${PORT}`)
  })
}

start()
