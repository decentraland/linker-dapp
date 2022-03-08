import { ChainId } from '@dcl/schemas'
import { AuthIdentity } from 'dcl-crypto'

export type LinkerResponseScenenDeploy = {
  responseType: 'scene-deploy'
  payload: {
    address: string
    signature: string
    chainId: ChainId
  }
}

export type LinkerResponseIdentity = {
  responseType: 'identity'
  payload: {
    address: string
    chainId: ChainId
    identity: AuthIdentity
  }
}

export type LinkerResponse = LinkerResponseScenenDeploy | LinkerResponseIdentity

export async function closeServer(
  ok: boolean,
  message: LinkerResponse
): Promise<void> {
  await fetch(`/api/close?ok=${ok}&reason=${JSON.stringify(message)}`)
}
