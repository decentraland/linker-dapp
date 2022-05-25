import { ChainId } from '@dcl/schemas'
import { AuthIdentity } from 'dcl-crypto'

export type DeployScene =
  | {
      address: string
      signature: string
      chainId: ChainId
    }
  | Record<string, never>

export type LinkerResponseIdentity = {
  responseType: 'identity'
  payload: {
    address: string
    chainId: ChainId
    identity: AuthIdentity
  }
}

export async function closeServer(
  ok: boolean,
  message: LinkerResponseIdentity
): Promise<void> {
  await fetch(`/api/close?ok=${ok}&reason=${JSON.stringify(message)}`)
}

export async function postDeploy(payload: DeployScene): Promise<void> {
  await fetch('/api/deploy', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
}

export async function getFilesRequest(): Promise<void> {
  return (await fetch('/api/files')).json()
}

export async function getInfoRequest(): Promise<void> {
  return (await fetch('/api/info')).json()
}

export async function getCatalystsPointer(): Promise<void> {
  return (await fetch('/api/catalyst-pointers')).json()
}
