import assert from 'node:assert'
import { assertStatus } from '../src/assertions.js'

describe('assertions.ts', function () {
  describe('assertStatus()', function () {
    it('throws if status is not as expected', function () {
      assert.throws(() => assertStatus({
        status: 200,
        headers: new Headers(),
        body: {}
      }, 201))
      assert.throws(() => assertStatus({
        status: 200,
        headers: new Headers(),
        body: {}
      }, 400))
      assert.throws(() => assertStatus({
        status: 500,
        headers: new Headers(),
        body: {}
      }, 400))
    })

    it('returns without throwing if status is as expected', function () {
      assertStatus({
        status: 200,
        headers: new Headers(),
        body: {}
      }, 200)
      assertStatus({
        status: 400,
        headers: new Headers(),
        body: {}
      }, 400)
      assertStatus({
        status: 500,
        headers: new Headers(),
        body: {}
      }, 500)
    })
  })
})
