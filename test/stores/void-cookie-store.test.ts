import assert from 'node:assert'
import { voidCookieStore } from '../../src/stores/void-cookie-store.js'
import type { Cookie } from '../../src/index.js'

describe('stores/void-cookie-store.ts', function () {
  it('initially returns empty cookies array', function () {
    const cookies: readonly Cookie[] = voidCookieStore().cookies
    assert.strictEqual(cookies.length, 0)
  })

  it('does not allow writing to cookies array', function () {
    const cookies: readonly Cookie[] = voidCookieStore().cookies
    assert.throws(() => {
      (cookies as any).push({})
    })
  })

  it('does nothing when trying to store a cookie', function () {
    const store = voidCookieStore()
    store.putCookie({
      key: 'foo',
      value: 'bar'
    })
    assert.strictEqual(store.cookies.length, 0)
  })
})
