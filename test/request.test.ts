import { requestFromAsync } from '../src/request.js'
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)

describe('request.ts', function () {
  it('can be awaited to obtain the response object', async function () {
    const response = {
      status: 200,
      headers: new Headers(),
      body: 'hello world'
    }
    const obj = requestFromAsync(Promise.resolve(response))
    const awaitedResponse = await obj
    expect(awaitedResponse).to.equal(response)
  })

  it('rejects if the input promise rejects', async function () {
    const rejected = Promise.reject(new Error('test reject'))
    await expect(requestFromAsync(rejected)).to.eventually.be.rejectedWith('test reject')
    const rejectSoon = new Promise<any>((resolve, reject) => setTimeout(() => reject(new Error('test reject')), 50))
    await expect(requestFromAsync(rejectSoon)).to.eventually.be.rejectedWith('test reject')
  })

  describe('#expect()', function () {
    it('returns the response body', async function () {
      const obj = requestFromAsync(Promise.resolve({
        status: 200,
        headers: new Headers(),
        body: 'hello world'
      }))
      await expect(obj.expect(200)).to.eventually.equal('hello world')
    })

    it('fails if status does not match expected', async function () {
      const obj = requestFromAsync(Promise.resolve({
        status: 200,
        headers: new Headers(),
        body: 'hello world'
      }))
      await expect(obj.expect(201)).to.eventually.be.rejected
    })

    it('rejects if the input promise rejects', async function () {
      const rejected = Promise.reject(new Error('test reject'))
      await expect(requestFromAsync(rejected).expect(200)).to.eventually.be.rejectedWith('test reject')
      const rejectSoon = new Promise<any>((resolve, reject) => setTimeout(() => reject(new Error('test reject')), 50))
      await expect(requestFromAsync(rejectSoon).expect(200)).to.eventually.be.rejectedWith('test reject')
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
      await expect(obj.raw()).to.eventually.equal(response)
    })

    it('rejects if the input promise rejects', async function () {
      const rejected = Promise.reject(new Error('test reject'))
      await expect(requestFromAsync(rejected).raw()).to.eventually.be.rejectedWith('test reject')
      const rejectSoon = new Promise<any>((resolve, reject) => setTimeout(() => reject(new Error('test reject')), 50))
      await expect(requestFromAsync(rejectSoon).raw()).to.eventually.be.rejectedWith('test reject')
    })
  })
})
