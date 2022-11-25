import { Cookie } from '../cookies.js'
import { CookieStore } from './cookie-store.js'

export function memoryCookieStore (): CookieStore {
  const cookies: Cookie[] = []

  return {
    cookies,
    putCookie (cookie) {
      const existing = cookies.findIndex(c => c.key === cookie.key)
      if (existing >= 0) {
        cookies[existing] = cookie
        return
      }
      cookies.push(cookie)
    }
  }
}
