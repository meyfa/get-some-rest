import { Cookie, parseCookies } from './cookies.js'
import { CookieStore } from './stores/cookie-store.js'
import { CaseInsensitiveHttpVerb, NetworkAdapter } from './adapters/network-adapter.js'
import { HttpRequest, requestFromAsync } from './request.js'

export type RequestMethod = <ResponseType = any>(path: string) => HttpRequest<ResponseType>
export type RequestMethodWithData = <ResponseType = any>(path: string, data?: any) => HttpRequest<ResponseType>

export interface HttpClient {
  request: <ResponseType = any>(verb: CaseInsensitiveHttpVerb, path: string, data?: any) => HttpRequest<ResponseType>
  get: RequestMethod
  post: RequestMethodWithData
  put: RequestMethodWithData
  patch: RequestMethodWithData
  delete: RequestMethod
  setCookie: (cookie: Cookie) => void
}

export function client (baseUrl: string | URL, adapter: NetworkAdapter, store: CookieStore): HttpClient {
  const request: HttpClient['request'] = (verb, path, data) => requestFromAsync(async () => {
    const response = await adapter.sendRequest({
      url: new URL(path, baseUrl),
      method: verb,
      data,
      cookies: store.cookies
    })
    parseCookies(response.headers).forEach((cookie) => store.putCookie(cookie))
    return response
  })

  return {
    request,
    get: (...args) => request('GET', ...args),
    post: (...args) => request('POST', ...args),
    put: (...args) => request('PUT', ...args),
    patch: (...args) => request('PATCH', ...args),
    delete: (...args) => request('DELETE', ...args),
    setCookie: (cookie) => store.putCookie(cookie)
  }
}
