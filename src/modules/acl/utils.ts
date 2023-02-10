import { ACLResponse } from './reducer'
import { InfoResponse, UpdatePayload } from './types'

export async function getInfoRequest(): Promise<InfoResponse> {
  return (await fetch('/acl')).json()
}

export async function getWorldACL(
  targetServer: string,
  worldName: string
): Promise<ACLResponse> {
  return (await fetch(`${targetServer}/acl/${worldName}`)).json()
}

export async function updateWorldACL(payload: UpdatePayload): Promise<void> {
  await fetch(`/acl`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
}
