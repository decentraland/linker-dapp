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
  deleteScenesFromWorldPayload?: string
  // Storage fields
  storageType?: StorageType
  key?: string
  value?: string
  address?: string
  world?: string
  action?: StorageAction
  targetUrl?: string
  multiScene?: boolean
}

export type DeployPhase =
  | 'awaiting-signature'
  | 'undeploying'
  | 'uploading'
  | 'deployed'
  | 'failed'
  | 'cancelled'

export type DeployUploadStage = 'checking' | 'uploading' | 'processing'

export type DeployUpload = {
  stage: DeployUploadStage
  sentBytes: number
  totalBytes: number
  completedBatches: number | null
  totalBatches: number | null
}

export type DeployState = {
  phase: DeployPhase
  upload: DeployUpload | null
  result: { entityId: string; message?: string } | null
  error: { code: string; message: string } | null
}

export const FINAL_DEPLOY_PHASES: DeployPhase[] = [
  'deployed',
  'failed',
  'cancelled',
]

export function isFinalDeployPhase(phase: DeployPhase): boolean {
  return FINAL_DEPLOY_PHASES.includes(phase)
}
