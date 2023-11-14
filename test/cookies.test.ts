import assert from 'node:assert'
import { Middleware, Response } from '../src/index.js'
import { cookieMiddleware } from '../src/cookies.js'
import { voidCookieStore } from '../src/stores/void-cookie-store.js'
import { memoryCookieStore } from '../src/stores/memory-cookie-store.js'

describe('cookies.ts', function () {
  describe('cookieMiddleware()', function () {
    const nextYear = new Date().getFullYear() + 1

    it('calls next() with unmodified request if the store has no cookies', async function () {
      const middleware: Middleware = cookieMiddleware(voidCookieStore())
      const expectedResponse: Response = {
        status: 200,
        headers: new Headers(),
        body: 'response body'
      }
      const middlewareResponse = await middleware({
        method: 'GET',
        url: new URL('http://localhost/'),
        headers: new Headers({
          'X-Test-Header': 'test-header-value'
        }),
        body: 'hello world'
      }, async (modified) => {
        assert.strictEqual(modified.url.toString(), 'http://localhost/')
        assert.strictEqual(modified.method, 'GET')
        assert.strictEqual(modified.body, 'hello world')
        assert.deepStrictEqual(Array.from(modified.headers), [
          ['x-test-header', 'test-header-value']
        ])
        return expectedResponse
      })
      // This implicitly ensures the middleware has called next(), otherwise it couldn't have gotten the response!
      assert.strictEqual(middlewareResponse, expectedResponse)
    })

    it('sets the Cookie header if the store has cookies', async function () {
      const store = memoryCookieStore()
      store.putCookie({
        key: 'test-cookie',
        value: 'test-cookie-value'
      })
      store.putCookie({
        key: 'foo2',
        value: 'bar'
      })
      const middleware: Middleware = cookieMiddleware(store)
      const expectedResponse: Response = {
        status: 200,
        headers: new Headers(),
        body: 'response body'
      }
      const middlewareResponse = await middleware({
        method: 'GET',
        url: new URL('http://localhost/'),
        headers: new Headers({
          'X-Test-Header': 'test-header-value'
        }),
        body: 'hello world'
      }, async (modified) => {
        assert.strictEqual(modified.url.toString(), 'http://localhost/')
        assert.strictEqual(modified.method, 'GET')
        assert.strictEqual(modified.body, 'hello world')
        assert.deepStrictEqual(Array.from(modified.headers), [
          ['cookie', 'test-cookie=test-cookie-value; foo2=bar'],
          ['x-test-header', 'test-header-value']
        ])
        return expectedResponse
      })
      // This implicitly ensures the middleware has called next(), otherwise it couldn't have gotten the response!
      assert.strictEqual(middlewareResponse, expectedResponse)
    })

    it('puts cookies from response header Set-Cookie into the store', async function () {
      const store = memoryCookieStore()
      const middleware: Middleware = cookieMiddleware(store)
      const expectedResponse: Response = {
        status: 200,
        headers: new Headers([
          ['set-cookie', `cookie1=value1; Expires=Mon, 12-Jul-${nextYear}; Secure`],
          ['set-cookie', 'cookie2=value2; Secure; HttpOnly'],
          ['set-cookie', 'cookie3=value3']
        ]),
        body: 'response body'
      }
      const middlewareResponse = await middleware({
        method: 'GET',
        url: new URL('http://localhost/'),
        headers: new Headers({
          'X-Test-Header': 'test-header-value'
        }),
        body: 'hello world'
      }, async (modified) => {
        assert.strictEqual(modified.url.toString(), 'http://localhost/')
        assert.strictEqual(modified.method, 'GET')
        assert.strictEqual(modified.body, 'hello world')
        assert.deepStrictEqual(Array.from(modified.headers), [
          ['x-test-header', 'test-header-value']
        ])
        return expectedResponse
      })
      // This implicitly ensures the middleware has called next(), otherwise it couldn't have gotten the response!
      assert.strictEqual(middlewareResponse, expectedResponse)
      assert.deepStrictEqual(store.cookies, [
        {
          key: 'cookie1',
          value: 'value1',
          expires: new Date(nextYear, 6, 12)
        },
        {
          key: 'cookie2',
          value: 'value2',
          expires: undefined
        },
        {
          key: 'cookie3',
          value: 'value3',
          expires: undefined
        }
      ])
    })

    it('unescapes cookies from response', async function () {
      const store = memoryCookieStore()
      const middleware: Middleware = cookieMiddleware(store)
      const expectedResponse: Response = {
        status: 200,
        headers: new Headers([
          ['set-cookie', 'session=kKw1VBLHevj5xGLYOdibAhJo4SIEAZAUrJdyA6mu0dwfE3hQm2mhCE%2FqZuasAspj0SeeueDjfFqmixNHtFcfKquJkJ6vrYL1WGVKdUisSHspDedug98E6e919nxAaQ%3D%3D%3BDij%2FTbm9SGHOyjb%2B9Dhyj%2Fiev9p%2B2Lkm']
        ]),
        body: 'response body'
      }
      const middlewareResponse = await middleware({
        method: 'GET',
        url: new URL('http://localhost/'),
        headers: new Headers(),
        body: 'hello world'
      }, async (modified) => {
        assert.strictEqual(modified.url.toString(), 'http://localhost/')
        assert.strictEqual(modified.method, 'GET')
        return expectedResponse
      })
      // This implicitly ensures the middleware has called next(), otherwise it couldn't have gotten the response!
      assert.strictEqual(middlewareResponse, expectedResponse)
      assert.deepStrictEqual(store.cookies, [
        {
          key: 'session',
          value: 'kKw1VBLHevj5xGLYOdibAhJo4SIEAZAUrJdyA6mu0dwfE3hQm2mhCE/qZuasAspj0SeeueDjfFqmixNHtFcfKquJkJ6vrYL1WGVKdUisSHspDedug98E6e919nxAaQ==;Dij/Tbm9SGHOyjb+9Dhyj/iev9p+2Lkm',
          expires: undefined
        }
      ])
    })

    it('escapes cookie values for request', async function () {
      const store = memoryCookieStore()
      store.putCookie({
        key: 'session',
        value: 'kKw1VBLHevj5xGLYOdibAhJo4SIEAZAUrJdyA6mu0dwfE3hQm2mhCE/qZuasAspj0SeeueDjfFqmixNHtFcfKquJkJ6vrYL1WGVKdUisSHspDedug98E6e919nxAaQ==;Dij/Tbm9SGHOyjb+9Dhyj/iev9p+2Lkm'
      })
      const middleware: Middleware = cookieMiddleware(store)
      const expectedResponse: Response = {
        status: 200,
        headers: new Headers(),
        body: 'response body'
      }
      const middlewareResponse = await middleware({
        method: 'GET',
        url: new URL('http://localhost/'),
        headers: new Headers()
      }, async (modified) => {
        assert.strictEqual(modified.url.toString(), 'http://localhost/')
        assert.strictEqual(modified.method, 'GET')
        assert.deepStrictEqual(Array.from(modified.headers), [
          ['cookie', 'session=kKw1VBLHevj5xGLYOdibAhJo4SIEAZAUrJdyA6mu0dwfE3hQm2mhCE%2FqZuasAspj0SeeueDjfFqmixNHtFcfKquJkJ6vrYL1WGVKdUisSHspDedug98E6e919nxAaQ%3D%3D%3BDij%2FTbm9SGHOyjb%2B9Dhyj%2Fiev9p%2B2Lkm']
        ])
        return expectedResponse
      })
      // This implicitly ensures the middleware has called next(), otherwise it couldn't have gotten the response!
      assert.strictEqual(middlewareResponse, expectedResponse)
    })
  })
})
