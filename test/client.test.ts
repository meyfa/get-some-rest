import assert from 'node:assert'
import { client } from '../src/client.js'
import type { Request, Response } from '../src/adapters/network-adapter.js'
import { getGlobalDispatcher, MockAgent, setGlobalDispatcher } from 'undici'
import { fetchNetworkAdapter } from '../src/adapters/fetch-network-adapter.js'

describe('client.ts', function () {
  const mockAgent = new MockAgent()
  mockAgent.disableNetConnect()

  const mockPool = mockAgent.get('https://test.local')

  const oldGlobalDispatcher = getGlobalDispatcher()
  before(() => setGlobalDispatcher(mockAgent))
  after(() => setGlobalDispatcher(oldGlobalDispatcher))

  describe('#request()', function () {
    it('can send GET requests', async function () {
      const c = client(new URL('https://test.local/baz/'), fetchNetworkAdapter())
      mockPool.intercept({ path: '/baz/1337', method: 'GET' }).reply(200, 'res1')
      const result = await c.request('GET', '1337').expect(200)
      assert.strictEqual(result, 'res1')
    })

    it('can send GET requests with headers', async function () {
      const c = client(new URL('https://test.local/baz/'), fetchNetworkAdapter())
      mockPool.intercept({
        path: '/baz/1338',
        method: 'GET',
        headers: (headers) => new Headers(headers).get('x-test') === 'test-get-with-headers'
      }).reply(200, 'res2')
      const result = await c.request('GET', '1338', undefined, {
        'X-Test': 'test-get-with-headers'
      }).expect(200)
      assert.strictEqual(result, 'res2')
    })

    it('can send POST requests without data', async function () {
      const c = client(new URL('https://test.local/baz/'), fetchNetworkAdapter())
      mockPool.intercept({ path: '/baz/1339', method: 'POST' }).reply(200, 'res3')
      const result = await c.request('POST', '1339').expect(200)
      assert.strictEqual(result, 'res3')
    })

    it('can send POST requests with data', async function () {
      const c = client(new URL('https://test.local/baz/'), fetchNetworkAdapter())
      mockPool.intercept({
        path: '/baz/1340',
        method: 'POST',
        body: '{"foo":"bar"}'
      }).reply(200, 'res4')
      const result = await c.request('POST', '1340', { foo: 'bar' }).expect(200)
      assert.strictEqual(result, 'res4')
    })

    it('can send POST requests with data and headers', async function () {
      const c = client(new URL('https://test.local/baz/'), fetchNetworkAdapter())
      mockPool.intercept({
        path: '/baz/1341',
        method: 'POST',
        body: '{"foo":"bar"}',
        headers: (headers) => new Headers(headers).get('x-test') === 'test-post-with-headers'
      }).reply(200, 'res5')
      const result = await c.request('POST', '1341', { foo: 'bar' }, {
        'X-Test': 'test-post-with-headers'
      }).expect(200)
      assert.strictEqual(result, 'res5')
    })
  })

  describe('#get()', function () {
    it('can send a request', async function () {
      const c = client(new URL('https://test.local/baz/'), fetchNetworkAdapter())
      mockPool.intercept({ path: '/baz/1337', method: 'GET' }).reply(200, 'res1')
      const result = await c.get('1337').expect(200)
      assert.strictEqual(result, 'res1')
    })

    it('can send a request with headers', async function () {
      const c = client(new URL('https://test.local/baz/'), fetchNetworkAdapter())
      mockPool.intercept({
        path: '/baz/1338',
        method: 'GET',
        headers: (headers) => new Headers(headers).get('x-test') === 'test-get-with-headers'
      }).reply(200, 'res2')
      const result = await c.get('1338', {
        'X-Test': 'test-get-with-headers'
      }).expect(200)
      assert.strictEqual(result, 'res2')
    })
  })

  describe('#post()', function () {
    it('can send a request', async function () {
      const c = client(new URL('https://test.local/baz/'), fetchNetworkAdapter())
      mockPool.intercept({ path: '/baz/1337', method: 'POST' }).reply(200, 'res1')
      const result = await c.post('1337').expect(200)
      assert.strictEqual(result, 'res1')
    })

    it('can send a request with data', async function () {
      const c = client(new URL('https://test.local/baz/'), fetchNetworkAdapter())
      mockPool.intercept({
        path: '/baz/1338',
        method: 'POST',
        body: '{"foo":"bar"}'
      }).reply(200, 'res2')
      const result = await c.post('1338', { foo: 'bar' }).expect(200)
      assert.strictEqual(result, 'res2')
    })

    it('can send a request with data and headers', async function () {
      const c = client(new URL('https://test.local/baz/'), fetchNetworkAdapter())
      mockPool.intercept({
        path: '/baz/1339',
        method: 'POST',
        body: '{"foo":"bar"}',
        headers: (headers) => new Headers(headers).get('x-test') === 'test-post-with-headers'
      }).reply(200, 'res3')
      const result = await c.post('1339', { foo: 'bar' }, {
        'X-Test': 'test-post-with-headers'
      }).expect(200)
      assert.strictEqual(result, 'res3')
    })
  })

  describe('#put()', function () {
    it('can send a request', async function () {
      const c = client(new URL('https://test.local/baz/'), fetchNetworkAdapter())
      mockPool.intercept({ path: '/baz/1337', method: 'PUT' }).reply(200, 'res1')
      const result = await c.put('1337').expect(200)
      assert.strictEqual(result, 'res1')
    })

    it('can send a request with data', async function () {
      const c = client(new URL('https://test.local/baz/'), fetchNetworkAdapter())
      mockPool.intercept({
        path: '/baz/1338',
        method: 'PUT',
        body: '{"foo":"bar"}'
      }).reply(200, 'res2')
      const result = await c.put('1338', { foo: 'bar' }).expect(200)
      assert.strictEqual(result, 'res2')
    })

    it('can send a request with data and headers', async function () {
      const c = client(new URL('https://test.local/baz/'), fetchNetworkAdapter())
      mockPool.intercept({
        path: '/baz/1339',
        method: 'PUT',
        body: '{"foo":"bar"}',
        headers: (headers) => new Headers(headers).get('x-test') === 'test-put-with-headers'
      }).reply(200, 'res3')
      const result = await c.put('1339', { foo: 'bar' }, {
        'X-Test': 'test-put-with-headers'
      }).expect(200)
      assert.strictEqual(result, 'res3')
    })
  })

  describe('#patch()', function () {
    it('can send a request', async function () {
      const c = client(new URL('https://test.local/baz/'), fetchNetworkAdapter())
      mockPool.intercept({ path: '/baz/1337', method: 'PATCH' }).reply(200, 'res1')
      const result = await c.patch('1337').expect(200)
      assert.strictEqual(result, 'res1')
    })

    it('can send a request with data', async function () {
      const c = client(new URL('https://test.local/baz/'), fetchNetworkAdapter())
      mockPool.intercept({
        path: '/baz/1338',
        method: 'PATCH',
        body: '{"foo":"bar"}'
      }).reply(200, 'res2')
      const result = await c.patch('1338', { foo: 'bar' }).expect(200)
      assert.strictEqual(result, 'res2')
    })

    it('can send a request with data and headers', async function () {
      const c = client(new URL('https://test.local/baz/'), fetchNetworkAdapter())
      mockPool.intercept({
        path: '/baz/1339',
        method: 'PATCH',
        body: '{"foo":"bar"}',
        headers: (headers) => new Headers(headers).get('x-test') === 'test-patch-with-headers'
      }).reply(200, 'res3')
      const result = await c.patch('1339', { foo: 'bar' }, {
        'X-Test': 'test-patch-with-headers'
      }).expect(200)
      assert.strictEqual(result, 'res3')
    })
  })

  describe('#delete()', function () {
    it('can send a request', async function () {
      const c = client(new URL('https://test.local/baz/'), fetchNetworkAdapter())
      mockPool.intercept({ path: '/baz/1337', method: 'DELETE' }).reply(200, 'res1')
      const result = await c.delete('1337').expect(200)
      assert.strictEqual(result, 'res1')
    })

    it('can send a request with headers', async function () {
      const c = client(new URL('https://test.local/baz/'), fetchNetworkAdapter())
      mockPool.intercept({
        path: '/baz/1338',
        method: 'DELETE',
        headers: (headers) => new Headers(headers).get('x-test') === 'test-delete-with-headers'
      }).reply(200, 'res2')
      const result = await c.delete('1338', {
        'X-Test': 'test-delete-with-headers'
      }).expect(200)
      assert.strictEqual(result, 'res2')
    })
  })

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
      await obj.request(originalRequest.method, '/', originalRequest.body)
      assert.deepStrictEqual(requestPassedToMiddleware1, originalRequest)
      assert.strictEqual(requestPassedToMiddleware2, requestAfterMiddleware1)
      assert.strictEqual(requestPassedToAdapter, requestAfterMiddleware2)
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
      const finalResponse = await obj.request('GET', '/')
      assert.strictEqual(responseInMiddleware2, adapterResponse)
      assert.strictEqual(responseInMiddleware1, responseAfterMiddleware2)
      assert.strictEqual(finalResponse, responseAfterMiddleware1)
    })
  })
})
