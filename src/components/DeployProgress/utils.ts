import { DeployState } from '../../modules/server/types'
import { isFinalDeployPhase } from '../../modules/server/utils'

export type DeployProgressView = {
  label: string
  // undefined when the progress can't be measured (indeterminate)
  percent: number | undefined
  bytes: string | undefined
  batches: string | undefined
}

function bytesToMB(bytes: number): string {
  return (bytes * 1e-6).toFixed(2)
}

function getLabel(state: DeployState): string {
  switch (state.phase) {
    case 'awaiting-signature':
      return 'Starting deployment...'
    case 'undeploying':
      return 'Removing previous scenes...'
    case 'deployed':
      return 'Deployed'
    case 'failed':
      return 'Deployment failed'
    case 'cancelled':
      return 'Deployment cancelled'
    default:
      break
  }
  switch (state.upload?.stage) {
    case 'uploading':
      return 'Uploading...'
    case 'processing':
      return 'Publishing...'
    default:
      return 'Checking files...'
  }
}

function getPercent(state: DeployState): number | undefined {
  if (state.phase === 'deployed') {
    return 100
  }
  const upload = state.upload
  if (!upload || upload.stage === 'checking') {
    return isFinalDeployPhase(state.phase) ? 0 : undefined
  }
  if (upload.stage === 'processing') {
    return 100
  }
  if (!upload.totalBytes) {
    return 0
  }
  return Math.min(100, Math.floor((upload.sentBytes / upload.totalBytes) * 100))
}

export function getDeployProgressView(state: DeployState): DeployProgressView {
  const upload = state.upload
  const hasBytes =
    !!upload && upload.stage !== 'checking' && upload.totalBytes > 0
  const hasBatches =
    !!upload && upload.completedBatches !== null && !!upload.totalBatches

  return {
    label: getLabel(state),
    percent: getPercent(state),
    bytes: hasBytes
      ? `${bytesToMB(upload.sentBytes)} MB / ${bytesToMB(upload.totalBytes)} MB`
      : undefined,
    batches: hasBatches
      ? `batch ${upload.completedBatches}/${upload.totalBatches}`
      : undefined,
  }
}
