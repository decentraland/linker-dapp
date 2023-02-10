export type InfoResponse = {
  worldName: string
  allowed: string[]
  targetServer: string
  payload: string // This is the data to sign
}

export type UpdatePayload = {
  signature: string
  address: string
}
