import { client, HttpClient } from './client.js'
import { voidCookieStore } from './stores/void-cookie-store.js'
import { memoryCookieStore } from './stores/memory-cookie-store.js'
import { fetchNetworkAdapter } from './adapters/fetch-network-adapter.js'

export { HttpVerb, CaseInsensitiveHttpVerb } from './adapters/network-adapter.js'
export { HttpClient, RequestMethod, RequestMethodWithData } from './client.js'
export { HttpRequest } from './request.js'
export { Cookie } from './cookies.js'

export function statelessClient (baseUrl: string | URL): HttpClient {
  return client(baseUrl, fetchNetworkAdapter(), voidCookieStore())
}

export function statefulClient (baseUrl: string | URL): HttpClient {
  return client(baseUrl, fetchNetworkAdapter(), memoryCookieStore())
}
