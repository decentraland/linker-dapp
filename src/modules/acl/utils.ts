import { WorldPermissionsResponse } from './reducer'
import { InfoResponse, UpdatePayload } from './types'

export async function getInfoRequest(): Promise<InfoResponse> {
  return (await fetch('/api/acl')).json()
}

export async function getWorldACL(
  targetContent: string,
  worldName: string
): Promise<WorldPermissionsResponse> {
  return (await fetch(`${targetContent}/world/${worldName}/permissions`)).json()
}

export async function updateWorldACL(payload: UpdatePayload): Promise<void> {
  await fetch(`/api/acl`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
}
