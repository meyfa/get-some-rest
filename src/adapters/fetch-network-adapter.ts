import { NetworkAdapter, Request } from './network-adapter.js'
import { joinCookies } from '../cookies.js'

export function fetchNetworkAdapter (): NetworkAdapter {
  return {
    async sendRequest (request) {
      const fetchResponse = await fetch(request.url, {
        method: request.method,
        headers: buildHeaders(request),
        body: transformRequestBody(request.data)
      })

      return {
        status: fetchResponse.status,
        headers: fetchResponse.headers,
        body: await parseBody(fetchResponse)
      }
    }
  }
}

function buildHeaders (request: Request): Record<string, string> {
  const headers = {}

  if (request.data != null) {
    Object.assign(headers, {
      'Content-Type': 'application/json'
    })
  }

  if (request.cookies != null && request.cookies.length > 0) {
    Object.assign(headers, {
      Cookie: joinCookies(request.cookies)
    })
  }

  return headers
}

function transformRequestBody (data: any): undefined | string {
  if (data == null) {
    return undefined
  }
  return JSON.stringify(data)
}

async function parseBody (result: globalThis.Response): Promise<any | undefined> {
  if (result.body == null) {
    return undefined
  }
  if (result.headers.get('content-type')?.split(';')[0].trim() === 'application/json') {
    return await result.json()
  }
  return await result.text()
}
