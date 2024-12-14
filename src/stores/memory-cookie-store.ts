import type { Cookie } from '../cookies.js'
import type { CookieStore } from './cookie-store.js'

export function memoryCookieStore (): CookieStore {
  let cookies: Cookie[] = []

  return {
    get cookies () {
      const now = new Date()
      cookies = cookies.filter((c) => c.expires == null || c.expires >= now)
      return cookies
    },
    putCookie (cookie) {
      const existing = cookies.findIndex((c) => c.key === cookie.key)
      if (existing >= 0) {
        cookies[existing] = cookie
        return
      }
      cookies.push(cookie)
    }
  }
}
