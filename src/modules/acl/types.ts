export type InfoResponse = {
  worldName: string
  allowed: string[]
  oldAllowed: string[]
  targetContent: string
  timestamp: Date
  expiration: number
  payload: string // This is the data to sign
}

export type UpdatePayload = {
  signature: string
  address: string
}
