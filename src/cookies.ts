import { CookieStore } from './stores/cookie-store.js'
import { Middleware } from './client.js'
import setCookieParser from 'set-cookie-parser'

export interface Cookie {
  key: string
  value: string
  expires?: Date
}

export function cookieMiddleware (store: CookieStore): Middleware {
  return async (req, next) => {
    for (const { key, value } of store.cookies) {
      req.headers.append('cookie', `${key}=${encodeURIComponent(value)}`)
    }
    const res = await next(req)
    parseCookies(res.headers).forEach((cookie) => store.putCookie(cookie))
    return res
  }
}

function parseCookies (headers: Headers): Cookie[] {
  const cookies = []
  // Note: Headers.prototype.getSetCookie() is available since Node.js 18.14.1, but types aren't updated yet.
  for (const cookieDefinition of (headers as any).getSetCookie() as readonly string[]) {
    const parsedCookie = setCookieParser.parseString(cookieDefinition)
    if (parsedCookie == null) {
      continue
    }
    cookies.push({
      key: parsedCookie.name,
      value: parsedCookie.value,
      expires: parsedCookie.expires
    })
  }
  return cookies
}
