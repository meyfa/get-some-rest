import type { CaseInsensitiveHttpVerb, NetworkAdapter, Request, Response } from './adapters/network-adapter.js'
import { type HttpRequest, requestFromAsync } from './request.js'

export type Middleware = (request: Request, next: (modified: Request) => Promise<Response>) => PromiseLike<Response>

export type RequestMethod = <ResponseType = any>(path: string, headers?: HeadersInit) => HttpRequest<ResponseType>
export type RequestMethodWithData = <ResponseType = any>(path: string, data?: any, headers?: HeadersInit) => HttpRequest<ResponseType>

export interface HttpClient {
  request: <ResponseType = any>(verb: CaseInsensitiveHttpVerb, path: string, data?: any, headers?: HeadersInit) => HttpRequest<ResponseType>
  get: RequestMethod
  post: RequestMethodWithData
  put: RequestMethodWithData
  patch: RequestMethodWithData
  delete: RequestMethod
  use: (middleware: Middleware) => void
}

async function processMiddleware (adapter: NetworkAdapter, request: Request, middleware: readonly Middleware[], offset = 0): Promise<Response> {
  if (offset >= middleware.length) {
    return await adapter.sendRequest(request)
  }
  const next = async (modified: Request): Promise<Response> => await processMiddleware(adapter, modified, middleware, offset + 1)
  return await middleware[offset](request, next)
}

export function client (baseUrl: string | URL, adapter: NetworkAdapter): HttpClient {
  const middlewareStack: Middleware[] = []

  const request: HttpClient['request'] = (verb, path, data, headers) => requestFromAsync(processMiddleware(adapter, {
    url: new URL(path, baseUrl),
    method: verb,
    body: data,
    headers: new Headers(headers)
  }, middlewareStack))

  return {
    request,
    get: (...args) => request('GET', args[0], undefined, args[1]),
    post: (...args) => request('POST', ...args),
    put: (...args) => request('PUT', ...args),
    patch: (...args) => request('PATCH', ...args),
    delete: (...args) => request('DELETE', args[0], undefined, args[1]),
    use: (middleware) => {
      middlewareStack.push(middleware)
    }
  }
}
