import { CookieStore } from './stores/cookie-store.js'
import { Middleware } from './client.js'

export interface Cookie {
  key: string
  value: string
}

export function cookieMiddleware (store: CookieStore): Middleware {
  return async (req, next) => {
    for (const { key, value } of store.cookies) {
      // TODO: Properly escape this stuff.
      req.headers.append('cookie', `${key}=${value}`)
    }
    const res = await next(req)
    parseCookies(res.headers).forEach((cookie) => store.putCookie(cookie))
    return res
  }
}

function parseCookies (headers: Headers): Cookie[] {
  // Node's Headers implementation returns all Set-Cookie headers joined by ', '
  // TODO: Since dates are represented like "Wed, 12-Jul-2023 19:59:03 GMT", this will split too often!
  const cookieDefinitions = headers.get('set-cookie')?.trim().split(/\s*,\s*/) ?? []

  const cookies = []
  for (const cookieDefinition of cookieDefinitions) {
    // TODO: Handle malformed strings, quoted values, escaping.
    // TODO: Parse expiration date and flags.
    const key = cookieDefinition.match(/^([^=\s]+)/)?.[1]
    const value = cookieDefinition.match(/^.*?=([^;=\s]+)/)?.[1]
    if (key != null && value != null) {
      cookies.push({ key, value })
    }
  }

  return cookies
}
