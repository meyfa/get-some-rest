import { CookieStore } from './cookie-store.js'

export function voidCookieStore (): CookieStore {
  return {
    cookies: Object.freeze([]),
    putCookie: () => {
    }
  }
}
