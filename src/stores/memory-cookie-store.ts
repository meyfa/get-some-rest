import { Cookie } from '../cookies.js'
import { CookieStore } from './cookie-store.js'

export function memoryCookieStore (): CookieStore {
  const cookies: Cookie[] = []

  return {
    cookies,
    putCookie (cookie) {
      cookies.push(cookie)
    }
  }
}
