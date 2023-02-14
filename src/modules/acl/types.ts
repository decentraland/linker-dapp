export type InfoResponse = {
  worldName: string
  allowed: string[]
  targetContent: string
  payload: string // This is the data to sign
}

export type UpdatePayload = {
  signature: string
  address: string
}
