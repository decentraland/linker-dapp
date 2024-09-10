import { AuthChain } from '@dcl/crypto'
import { QuestInfoResponse } from './types'

export async function getQuestsInfoRequest(): Promise<QuestInfoResponse> {
  return (await fetch(`/api/info`)).json()
}

export async function sendSignedFetch(payload: {
  address: string
  authChain: AuthChain
}): Promise<void> {
  await fetch(`/api/quests`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
}
