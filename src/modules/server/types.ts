export type InfoResponse = {
  baseParcel: string
  parcels: string[]
  rootCID: string
  landRegistry?: string
  estateRegistry?: string
  debug: boolean
  title?: string
  description?: string
  skipValidations: boolean
}
