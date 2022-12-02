import { client, HttpClient } from './client.js'
import { memoryCookieStore } from './stores/memory-cookie-store.js'
import { fetchNetworkAdapter } from './adapters/fetch-network-adapter.js'
import { Cookie, cookieMiddleware } from './cookies.js'

export { HttpVerb, CaseInsensitiveHttpVerb, Request, Response } from './adapters/network-adapter.js'
export { HttpClient, RequestMethod, RequestMethodWithData, Middleware } from './client.js'
export { HttpRequest } from './request.js'
export { Cookie } from './cookies.js'

export function statelessClient (baseUrl: string | URL): HttpClient {
  return client(baseUrl, fetchNetworkAdapter())
}

export interface StatefulHttpClient extends HttpClient {
  setCookie: (cookie: Cookie) => void
  getCookie: (key: string) => string | undefined
}

export function statefulClient (baseUrl: string | URL): StatefulHttpClient {
  const createdClient = client(baseUrl, fetchNetworkAdapter())

  const store = memoryCookieStore()
  createdClient.use(cookieMiddleware(store))

  return Object.assign(createdClient, {
    setCookie: (cookie: Cookie) => store.putCookie(cookie),
    getCookie: (key: string) => store.cookies.find(c => c.key === key)?.value
  })
}
