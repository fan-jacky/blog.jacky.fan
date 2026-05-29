import express from 'express'
import payload from 'payload'
import path from 'path'

require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

if (!process.env.PAYLOAD_SECRET) {
  throw new Error('PAYLOAD_SECRET environment variable is required but not set.')
}

const app = express()

// Redirect root to Admin panel
app.get('/', (_, res) => {
  res.redirect('/admin')
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
