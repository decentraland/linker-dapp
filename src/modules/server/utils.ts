import { Network } from '@dcl/schemas'

export type LinkerResponse = {
  address: string
  signature: string
  network: Network
}

export async function closeServer(
  ok: boolean,
  message: LinkerResponse
): Promise<void> {
  await fetch(`/api/close?ok=${ok}&reason=${JSON.stringify(message)}`)
}
