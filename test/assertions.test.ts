import { expect } from 'chai'
import { assertStatus } from '../src/assertions.js'

describe('assertions.ts', function () {
  describe('assertStatus()', function () {
    it('throws if status is not as expected', function () {
      expect(() => assertStatus({
        status: 200,
        headers: new Headers(),
        body: {}
      }, 201)).to.throw()
      expect(() => assertStatus({
        status: 200,
        headers: new Headers(),
        body: {}
      }, 400)).to.throw()
      expect(() => assertStatus({
        status: 500,
        headers: new Headers(),
        body: {}
      }, 400)).to.throw()
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
