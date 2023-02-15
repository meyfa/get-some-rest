import assert from 'node:assert'
import { requestFromAsync } from '../src/request.js'

describe('request.ts', function () {
  it('can be awaited to obtain the response object', async function () {
    const response = {
      status: 200,
      headers: new Headers(),
      body: 'hello world'
    }
    const obj = requestFromAsync(Promise.resolve(response))
    const awaitedResponse = await obj
    assert.strictEqual(awaitedResponse, response)
  })

  it('rejects if the input promise rejects', async function () {
    const rejected = Promise.reject(new Error('test reject'))
    await assert.rejects(Promise.resolve(requestFromAsync(rejected)), new Error('test reject'))
    const rejectSoon = new Promise<any>((resolve, reject) => setTimeout(() => reject(new Error('test reject')), 50))
    await assert.rejects(Promise.resolve(requestFromAsync(rejectSoon)), new Error('test reject'))
  })

  describe('#expect()', function () {
    it('returns the response body', async function () {
      const obj = requestFromAsync(Promise.resolve({
        status: 200,
        headers: new Headers(),
        body: 'hello world'
      }))
      assert.strictEqual(await obj.expect(200), 'hello world')
    })

    it('fails if status does not match expected', async function () {
      const obj = requestFromAsync(Promise.resolve({
        status: 200,
        headers: new Headers(),
        body: 'hello world'
      }))
      await assert.rejects(obj.expect(201))
    })

    it('rejects if the input promise rejects', async function () {
      const rejected = Promise.reject(new Error('test reject'))
      await assert.rejects(requestFromAsync(rejected).expect(200), new Error('test reject'))
      const rejectSoon = new Promise<any>((resolve, reject) => setTimeout(() => reject(new Error('test reject')), 50))
      await assert.rejects(requestFromAsync(rejectSoon).expect(200), new Error('test reject'))
    })
  })

  describe('#raw()', function () {
    it('returns the response as-is', async function () {
      const response = {
        status: 200,
        headers: new Headers(),
        body: 'hello world'
      }
      const obj = requestFromAsync(Promise.resolve(response))
      assert.strictEqual(await obj.raw(), response)
    })

    it('rejects if the input promise rejects', async function () {
      const rejected = Promise.reject(new Error('test reject'))
      await assert.rejects(requestFromAsync(rejected).raw(), new Error('test reject'))
      const rejectSoon = new Promise<any>((resolve, reject) => setTimeout(() => reject(new Error('test reject')), 50))
      await assert.rejects(requestFromAsync(rejectSoon).raw(), new Error('test reject'))
    })
  })
})
