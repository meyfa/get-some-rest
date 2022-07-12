export type HttpVerb = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
export type CaseInsensitiveHttpVerb = Uppercase<HttpVerb> | Lowercase<HttpVerb>

export interface Request {
  url: URL
  method: CaseInsensitiveHttpVerb
  body?: any | undefined
  headers: Headers
}

export interface Response {
  status: number
  headers: Headers
  body: unknown
}

export interface NetworkAdapter {
  sendRequest: (request: Request) => Promise<Response>
}
