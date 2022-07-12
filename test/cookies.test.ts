import { Middleware, Response } from '../src/index.js'
import { cookieMiddleware } from '../src/cookies.js'
import { voidCookieStore } from '../src/stores/void-cookie-store.js'
import { expect } from 'chai'
import { memoryCookieStore } from '../src/stores/memory-cookie-store.js'

describe('cookies.ts', function () {
  describe('cookieMiddleware()', function () {
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
        expect(modified.url.toString()).to.equal('http://localhost/')
        expect(modified.method).to.equal('GET')
        expect(modified.body).to.equal('hello world')
        expect(Array.from(modified.headers)).to.have.deep.members([
          ['x-test-header', 'test-header-value']
        ])
        return expectedResponse
      })
      // This implicitly ensures the middleware has called next(), otherwise it couldn't have gotten the response!
      expect(middlewareResponse).to.equal(expectedResponse)
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
        expect(modified.url.toString()).to.equal('http://localhost/')
        expect(modified.method).to.equal('GET')
        expect(modified.body).to.equal('hello world')
        expect(Array.from(modified.headers)).to.have.deep.members([
          ['x-test-header', 'test-header-value'],
          ['cookie', 'test-cookie=test-cookie-value; foo2=bar']
        ])
        return expectedResponse
      })
      // This implicitly ensures the middleware has called next(), otherwise it couldn't have gotten the response!
      expect(middlewareResponse).to.equal(expectedResponse)
    })

    it('puts cookies from response header Set-Cookie into the store', async function () {
      const store = memoryCookieStore()
      const middleware: Middleware = cookieMiddleware(store)
      const expectedResponse: Response = {
        status: 200,
        headers: new Headers({
          // TODO: Change this to be valid (not comma separated, but repeated Set-Cookie) once Node supports it.
          'set-cookie': 'cookie1=value1; Expires=Mon, 12-Jul-2022; Secure, cookie2=value2; Secure; HttpOnly, cookie3=value3'
        }),
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
        expect(modified.url.toString()).to.equal('http://localhost/')
        expect(modified.method).to.equal('GET')
        expect(modified.body).to.equal('hello world')
        expect(Array.from(modified.headers)).to.have.deep.members([
          ['x-test-header', 'test-header-value']
        ])
        return expectedResponse
      })
      // This implicitly ensures the middleware has called next(), otherwise it couldn't have gotten the response!
      expect(middlewareResponse).to.equal(expectedResponse)
      expect(store.cookies).to.have.deep.members([
        {
          key: 'cookie1',
          value: 'value1'
        },
        {
          key: 'cookie2',
          value: 'value2'
        },
        {
          key: 'cookie3',
          value: 'value3'
        }
      ])
    })
  })
})
