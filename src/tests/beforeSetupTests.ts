import fetch, { Request, Response } from 'node-fetch'
import { TextEncoder, TextDecoder } from 'util'

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder as any

if (!globalThis.fetch) {
  globalThis.fetch = fetch as any
  globalThis.Request = Request as any
  globalThis.Response = Response as any
}
