import { QuestInfoResponse } from "./types";


export async function getQuestsInfoRequest(): Promise<QuestInfoResponse> {
	return (await fetch(`http://localhost:3003/api/quests`)).json()
}

export async function sendSignedFetch(payload: { address: string, signature: string }): Promise<void> {
	await fetch(`http://localhost:3003/api/quests`, {
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(payload)
	})
}