import { expect } from 'chai'
import { voidCookieStore } from '../../src/stores/void-cookie-store.js'
import { Cookie } from '../../src/index.js'

describe('stores/void-cookie-store.ts', function () {
  it('initially returns empty cookies array', function () {
    const cookies: readonly Cookie[] = voidCookieStore().cookies
    expect(cookies).to.have.lengthOf(0)
  })

  it('does not allow writing to cookies array', function () {
    const cookies: readonly Cookie[] = voidCookieStore().cookies
    expect(() => {
      (cookies as any).push({})
    }).to.throw()
  })

  it('does nothing when trying to store a cookie', function () {
    const store = voidCookieStore()
    store.putCookie({
      key: 'foo',
      value: 'bar'
    })
    expect(store.cookies).to.have.lengthOf(0)
  })
})
