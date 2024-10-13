export type HttpVerb = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
export type CaseInsensitiveHttpVerb = Uppercase<HttpVerb> | Lowercase<HttpVerb>

export interface Request {
  url: URL
  method: CaseInsensitiveHttpVerb
  body?: any
  headers: Headers
}

export interface Response<Body = unknown> {
  status: number
  headers: Headers
  body: Body
}

export interface NetworkAdapter {
  sendRequest: (request: Request) => Promise<Response>
}
