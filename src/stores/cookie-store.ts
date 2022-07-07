import { Cookie } from '../cookies.js'

export interface CookieStore {
  readonly cookies: readonly Cookie[]
  putCookie: (cookie: Cookie) => void
}
