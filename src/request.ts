import { Response } from './adapters/network-adapter.js'
import { assertStatus } from './assertions.js'

export interface HttpRequest<ResponseType = any> {
  expect: (status: number) => Promise<ResponseType>
  raw: () => Promise<Response<ResponseType>>
}

export function requestFromAsync<ResponseType> (getResponse: () => PromiseLike<Response>): HttpRequest<ResponseType> {
  return {
    async expect (statusNumber) {
      const response = await getResponse()
      assertStatus(response, statusNumber)
      // We have absolutely no type safety here!
      return response.body as any
    },

    async raw () {
      return (await getResponse()) as Response<ResponseType>
    }
  }
}
