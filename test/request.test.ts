import { requestFromAsync } from '../src/request.js'
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)

describe('request.ts', function () {
  describe('#expect()', function () {
    it('returns the response body', async function () {
      const obj = requestFromAsync(async () => {
        return {
          status: 200,
          headers: new Headers(),
          body: 'hello world'
        }
      })
      await expect(obj.expect(200)).to.eventually.equal('hello world')
    })

    it('fails if status does not match expected', async function () {
      const obj = requestFromAsync(async () => {
        return {
          status: 200,
          headers: new Headers(),
          body: 'hello world'
        }
      })
      await expect(obj.expect(201)).to.eventually.be.rejected
    })
  })

  describe('#raw()', function () {
    it('returns the response as-is', async function () {
      const response = {
        status: 200,
        headers: new Headers(),
        body: 'hello world'
      }
      const obj = requestFromAsync(async () => response)
      await expect(obj.raw()).to.eventually.equal(response)
    })
  })
})
