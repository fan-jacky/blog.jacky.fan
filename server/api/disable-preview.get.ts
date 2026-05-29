export default defineEventHandler(async (event) => {
  deleteCookie(event, 'payload-preview', { path: '/' })
  return sendRedirect(event, '/')
})
