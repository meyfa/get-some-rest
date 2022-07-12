import { client } from '../src/client.js'
import { Request, Response } from '../src/adapters/network-adapter.js'
import { expect } from 'chai'

describe('client.ts', function () {
  describe('#use()', function () {
    it('passes the request through the middleware stack', async function () {
      const originalRequest: Request = {
        method: 'POST',
        headers: new Headers(),
        url: new URL('http://localhost/'),
        body: 'originalData'
      }
      const requestAfterMiddleware1: Request = {
        ...originalRequest,
        body: 'modified1'
      }
      const requestAfterMiddleware2: Request = {
        ...originalRequest,
        body: 'modified2'
      }
      let requestPassedToAdapter
      const obj = client('http://localhost', {
        async sendRequest (req) {
          requestPassedToAdapter = req
          return {
            status: 200,
            headers: new Headers(),
            body: undefined
          }
        }
      })
      let requestPassedToMiddleware1
      obj.use(async (req, next) => {
        requestPassedToMiddleware1 = req
        return await next(requestAfterMiddleware1)
      })
      let requestPassedToMiddleware2
      obj.use(async (req, next) => {
        requestPassedToMiddleware2 = req
        return await next(requestAfterMiddleware2)
      })
      await obj.request(originalRequest.method, '/', originalRequest.body).raw()
      expect(requestPassedToMiddleware1).to.deep.equal(originalRequest)
      expect(requestPassedToMiddleware2).to.equal(requestAfterMiddleware1)
      expect(requestPassedToAdapter).to.equal(requestAfterMiddleware2)
    })

    it('passes the response backwards through the middleware stack', async function () {
      const adapterResponse: Response = {
        status: 200,
        headers: new Headers(),
        body: 'originalResponseData'
      }
      const responseAfterMiddleware1: Response = {
        ...adapterResponse,
        body: 'modifiedResponse1'
      }
      const responseAfterMiddleware2: Response = {
        ...adapterResponse,
        body: 'modifiedResponse2'
      }
      const obj = client('http://localhost', {
        sendRequest: async () => adapterResponse
      })
      let responseInMiddleware1
      obj.use(async (req, next) => {
        responseInMiddleware1 = await next(req)
        return responseAfterMiddleware1
      })
      let responseInMiddleware2
      obj.use(async (req, next) => {
        responseInMiddleware2 = await next(req)
        return responseAfterMiddleware2
      })
      const finalResponse = await obj.request('GET', '/').raw()
      expect(responseInMiddleware2).to.equal(adapterResponse)
      expect(responseInMiddleware1).to.equal(responseAfterMiddleware2)
      expect(finalResponse).to.equal(responseAfterMiddleware1)
    })
  })
})
