export type StorageType = 'env' | 'scene' | 'player'
export type StorageAction = 'get' | 'set' | 'delete' | 'clear'

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
  isPortableExperience: boolean
  isWorld: boolean
  // Storage fields
  storageType?: StorageType
  key?: string
  value?: string
  address?: string
  world?: string
  action?: StorageAction
  targetUrl?: string
}
