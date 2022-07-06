export interface Cookie {
  key: string
  value: string
}

export function parseCookies (headers: Headers): Cookie[] {
  // Node's Headers implementation returns all Set-Cookie headers joined by ', '
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

export function joinCookies (cookies: readonly Cookie[]): string {
  // TODO: Properly escape this stuff.
  return cookies.map(({ key, value }) => `${key}=${value}`).join('; ')
}
