import { expect } from 'chai'
import { memoryCookieStore } from '../../src/stores/memory-cookie-store.js'
import { Cookie } from '../../src/index.js'

describe('stores/memory-cookie-store.ts', function () {
  it('initially returns empty cookies array', function () {
    const cookies: readonly Cookie[] = memoryCookieStore().cookies
    expect(cookies).to.have.lengthOf(0)
  })

  it('stores cookies', function () {
    const store = memoryCookieStore()
    const cookie = {
      key: 'foo',
      value: 'bar'
    }
    store.putCookie(cookie)
    expect(store.cookies).to.deep.equal([cookie])
    const cookie2 = {
      key: 'foo2',
      value: 'baz'
    }
    store.putCookie(cookie2)
    expect(store.cookies).to.deep.equal([cookie, cookie2])
  })

  it('overwrites cookies when key is identical', function () {
    const store = memoryCookieStore()
    const cookie = {
      key: 'foo',
      value: 'bar'
    }
    store.putCookie(cookie)
    expect(store.cookies).to.deep.equal([cookie])
    const cookie2 = {
      key: 'foo',
      value: 'baz'
    }
    store.putCookie(cookie2)
    expect(store.cookies).to.deep.equal([cookie2])
  })
})
