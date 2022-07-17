import { Response } from './adapters/network-adapter.js'
import { assertStatus } from './assertions.js'

export interface HttpRequest<ResponseType = any> extends PromiseLike<Response<ResponseType>> {
  expect: (status: number) => Promise<ResponseType>
  raw: () => Promise<Response<ResponseType>>
}

export function requestFromAsync<ResponseType> (responsePromise: PromiseLike<Response>): HttpRequest<ResponseType> {
  const untypedResponsePromise = responsePromise as PromiseLike<Response<ResponseType>>

  return {
    then: (...args) => untypedResponsePromise.then(...args),

    async expect (statusNumber) {
      const response = await untypedResponsePromise
      assertStatus(response, statusNumber)
      // We have absolutely no type safety here!
      return response.body
    },

    async raw () {
      return await untypedResponsePromise
    }
  }
}
