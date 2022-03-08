import { ChainId } from '@dcl/schemas'
import { AuthIdentity } from 'dcl-crypto'

export type LinkerResponseType = 'scene-deploy' | 'identity'

export type LinkerResponse = {
  type: LinkerResponseType
  data:
    | {
        address: string
        signature: string
        chainId: ChainId
      }
    | {
        identity: AuthIdentity
      }
}

export async function closeServer(
  ok: boolean,
  message: LinkerResponse
): Promise<void> {
  await fetch(`/api/close?ok=${ok}&reason=${JSON.stringify(message)}`)
}
