import { Response } from './adapters/network-adapter.js'
import assert from 'node:assert'

export function assertStatus (response: Response, status: number): void {
  if (response.status !== status) {
    assert.strictEqual(response.status, status)
  }
}
