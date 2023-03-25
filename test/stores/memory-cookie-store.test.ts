import assert from 'node:assert'
import { memoryCookieStore } from '../../src/stores/memory-cookie-store.js'
import { Cookie } from '../../src/index.js'
import { setTimeout } from 'node:timers/promises'

describe('stores/memory-cookie-store.ts', function () {
  it('initially returns empty cookies array', function () {
    const cookies: readonly Cookie[] = memoryCookieStore().cookies
    assert.strictEqual(cookies.length, 0)
  })

  it('stores cookies', function () {
    const store = memoryCookieStore()
    const cookie = {
      key: 'foo',
      value: 'bar'
    }
    store.putCookie(cookie)
    assert.deepStrictEqual(store.cookies, [cookie])
    const cookie2 = {
      key: 'foo2',
      value: 'baz'
    }
    store.putCookie(cookie2)
    assert.deepStrictEqual(store.cookies, [cookie, cookie2])
  })

  it('overwrites cookies when key is identical', function () {
    const store = memoryCookieStore()
    const cookie = {
      key: 'foo',
      value: 'bar'
    }
    store.putCookie(cookie)
    assert.deepStrictEqual(store.cookies, [cookie])
    const cookie2 = {
      key: 'foo',
      value: 'baz'
    }
    store.putCookie(cookie2)
    assert.deepStrictEqual(store.cookies, [cookie2])
  })

  it('removes cookies when expires is in the past', function () {
    const store = memoryCookieStore()
    store.putCookie({ key: 'foo', value: 'bar' })
    store.putCookie({ key: 'foo', value: 'baz', expires: new Date(0) })
    assert.deepStrictEqual(store.cookies, [])
  })

  it('does not return cookies that have expired', async function () {
    const store = memoryCookieStore()
    const cookie = {
      key: 'foo',
      value: 'bar',
      expires: new Date(Date.now() + 50)
    }
    store.putCookie(cookie)
    assert.deepStrictEqual(store.cookies, [cookie])
    await setTimeout(100)
    assert.deepStrictEqual(store.cookies, [])
  })
})
