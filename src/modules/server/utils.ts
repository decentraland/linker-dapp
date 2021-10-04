import { ChainId } from '@dcl/schemas'

export type LinkerResponse = {
  address: string
  signature: string
  chainId: ChainId
}

export async function closeServer(
  ok: boolean,
  message: LinkerResponse
): Promise<void> {
  await fetch(`/api/close?ok=${ok}&reason=${JSON.stringify(message)}`)
}
