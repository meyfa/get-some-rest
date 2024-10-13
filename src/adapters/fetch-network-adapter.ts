import { NetworkAdapter, Request } from './network-adapter.js'

export function fetchNetworkAdapter (): NetworkAdapter {
  return {
    async sendRequest (request) {
      const fetchResponse = await fetch(request.url, {
        method: request.method,
        headers: buildHeaders(request),
        body: transformRequestBody(request.body)
      })

      return {
        status: fetchResponse.status,
        headers: fetchResponse.headers,
        body: await parseBody(fetchResponse)
      }
    }
  }
}

function buildHeaders (request: Request): Headers {
  const headers = new Headers(request.headers)

  if (request.body != null && !headers.has('content-type')) {
    headers.set('content-type', 'application/json')
  }

  return headers
}

function transformRequestBody (data: any): undefined | string {
  if (data == null) {
    return undefined
  }
  return JSON.stringify(data)
}

async function parseBody (result: globalThis.Response): Promise<any> {
  if (result.body == null) {
    return undefined
  }
  if (result.headers.get('content-type')?.split(';')[0].trim() === 'application/json') {
    return await result.json()
  }
  return await result.text()
}
