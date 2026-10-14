import { ChainId } from '@dcl/schemas'
import { AuthChain, AuthIdentity } from '@dcl/crypto'
import {
  DeployPhase,
  DeployState,
  DeployUpload,
  DeployUploadStage,
  InfoResponse,
} from './types'

export type DeployScene =
  | {
      address: string
      authChain: AuthChain
      chainId: ChainId
      deleteSignature?: string
    }
  | Record<string, never>

export type LinkerResponseIdentity = {
  responseType: 'identity'
  payload: {
    address: string
    chainId: ChainId
    identity: AuthIdentity
  }
}

export async function closeServer(
  ok: boolean,
  message: LinkerResponseIdentity,
): Promise<void> {
  await fetch(`/api/close?ok=${ok}&reason=${JSON.stringify(message)}`)
}

export const DEPLOY_URL = '/api/deploy'

export const CANCEL_WHILE_UNDEPLOYING_MESSAGE =
  "Can't cancel while removing the previous scenes"

export const CANCEL_FORBIDDEN_MESSAGE =
  "This page can't cancel the deployment; cancel it from the terminal (Ctrl+C)"

const DEPLOY_PHASES: DeployPhase[] = [
  'awaiting-signature',
  'undeploying',
  'uploading',
  'deployed',
  'failed',
  'cancelled',
]

const FINAL_DEPLOY_PHASES: DeployPhase[] = ['deployed', 'failed', 'cancelled']

const DEPLOY_UPLOAD_STAGES: DeployUploadStage[] = [
  'checking',
  'uploading',
  'processing',
]

export function isFinalDeployPhase(phase: DeployPhase): boolean {
  return FINAL_DEPLOY_PHASES.includes(phase)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object'
}

function isCount(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
}

function parseUpload(value: unknown): DeployUpload | null {
  if (
    !isRecord(value) ||
    !DEPLOY_UPLOAD_STAGES.includes(value.stage as DeployUploadStage) ||
    !isCount(value.sentBytes) ||
    !isCount(value.totalBytes)
  ) {
    return null
  }
  return {
    stage: value.stage as DeployUploadStage,
    sentBytes: value.sentBytes,
    totalBytes: value.totalBytes,
    completedBatches: isCount(value.completedBatches)
      ? value.completedBatches
      : null,
    totalBatches: isCount(value.totalBatches) ? value.totalBatches : null,
  }
}

function parseResult(value: unknown): DeployState['result'] {
  if (!isRecord(value) || typeof value.entityId !== 'string') {
    return null
  }
  return typeof value.message === 'string'
    ? { entityId: value.entityId, message: value.message }
    : { entityId: value.entityId }
}

function parseError(value: unknown): DeployState['error'] {
  if (
    !isRecord(value) ||
    typeof value.code !== 'string' ||
    typeof value.message !== 'string'
  ) {
    return null
  }
  return { code: value.code, message: value.message }
}

/**
 * Validates a deployment state received from the CLI. Returns undefined for an
 * unknown phase; malformed optional fields are normalised to null.
 */
export function parseDeployState(value: unknown): DeployState | undefined {
  if (
    !isRecord(value) ||
    !DEPLOY_PHASES.includes(value.phase as DeployPhase)
  ) {
    return undefined
  }
  const state: DeployState = {
    phase: value.phase as DeployPhase,
    upload: parseUpload(value.upload),
    result: parseResult(value.result),
    error: parseError(value.error),
  }
  if (typeof value.cancelRequested === 'boolean') {
    state.cancelRequested = value.cancelRequested
  }
  return state
}

async function readDeployState(response: Response): Promise<DeployState> {
  const body: unknown = await response.json().catch(() => undefined)
  const state = parseDeployState(body)
  if (!state) {
    throw new Error('Unexpected deployment state received from the CLI')
  }
  return state
}

async function discardBody(response: Response): Promise<void> {
  try {
    await response.body?.cancel()
  } catch {
    // Nothing to release
  }
}

async function readErrorMessage(
  response: Response,
): Promise<string | undefined> {
  const text = await response.text().catch(() => '')
  try {
    const body: unknown = JSON.parse(text)
    return isRecord(body) && typeof body.message === 'string'
      ? body.message
      : undefined
  } catch {
    return undefined
  }
}

/**
 * Starts the deployment. Resolves with the deployment state when the CLI runs
 * it in the background (202), or with undefined when an older CLI held the
 * request until the deployment ended (200).
 */
export async function postDeploy(
  payload: DeployScene,
): Promise<DeployState | undefined> {
  const response = await fetch(DEPLOY_URL, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Prefer: 'respond-async',
    },
    body: JSON.stringify(payload),
  })
  if (response.status === 202 || response.status === 409) {
    return readDeployState(response)
  }
  if (response.ok) {
    await discardBody(response)
    return
  }
  throw new Error(
    (await readErrorMessage(response)) ||
      `Could not deploy the scene (${response.status})`,
  )
}

/** Resolves with undefined when the CLI does not expose the deployment state. */
export async function getDeployStateRequest(): Promise<DeployState | undefined> {
  const response = await fetch(DEPLOY_URL, {
    headers: { Accept: 'application/json' },
  })
  if (response.status === 404) {
    await discardBody(response)
    return
  }
  if (!response.ok) {
    await discardBody(response)
    throw new Error(`Could not get the deployment state (${response.status})`)
  }
  return readDeployState(response)
}

/**
 * Asks the CLI to cancel the deployment. Resolves with the deployment state;
 * the outcome of the cancellation is reported by the state that follows.
 */
export async function deleteDeploy(token: string): Promise<DeployState> {
  const response = await fetch(DEPLOY_URL, {
    method: 'delete',
    headers: { 'X-Deploy-Token': token },
  })
  if (response.status === 202) {
    return readDeployState(response)
  }
  if (response.status === 409) {
    const state = await readDeployState(response)
    if (state.phase === 'undeploying') {
      throw new Error(CANCEL_WHILE_UNDEPLOYING_MESSAGE)
    }
    return state
  }
  if (response.status === 403) {
    await discardBody(response)
    throw new Error(CANCEL_FORBIDDEN_MESSAGE)
  }
  throw new Error(
    (await readErrorMessage(response)) ||
      `Could not cancel the deployment (${response.status})`,
  )
}

/**
 * Follows the deployment state through server-sent events. Returns a function
 * that closes the stream. The stream is closed as soon as a final state is
 * received, so the browser doesn't reconnect once the CLI ends it.
 */
export function subscribeToDeployState(
  onState: (state: DeployState) => void,
  onError: () => void,
): () => void {
  if (typeof EventSource === 'undefined') {
    onError()
    return () => undefined
  }
  const source = new EventSource(DEPLOY_URL)
  source.addEventListener('state', (event) => {
    let state: DeployState | undefined
    try {
      state = parseDeployState(JSON.parse((event as MessageEvent<string>).data))
    } catch {
      state = undefined
    }
    if (!state) {
      onError()
      return
    }
    if (isFinalDeployPhase(state.phase)) {
      source.close()
    }
    onState(state)
  })
  source.onerror = () => onError()
  return () => source.close()
}

export type StoragePayload = {
  address: string
  authChain: AuthChain
  chainId: ChainId
}

export type StorageResponse = {
  success: boolean
  error?: string
}

export async function postStorage(payload: StoragePayload): Promise<void> {
  const response = await fetch(`/api/storage`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const result = (await response.json().catch(() => ({}))) as StorageResponse

  if (result.success) {
    return
  }

  throw new Error(result.error || 'Storage operation failed')
}

export async function postLogs(payload: StoragePayload): Promise<void> {
  const response = await fetch(`/api/logs`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const result = (await response.json().catch(() => ({}))) as StorageResponse

  if (result.success) {
    return
  }

  throw new Error(result.error || 'Logs authentication failed')
}

export async function getFilesRequest(): Promise<void> {
  return (await fetch(`/api/files`)).json()
}

export async function getInfoRequest(): Promise<InfoResponse> {
  return (await fetch(`/api/info`)).json()
}

export async function getCatalystsPointer(): Promise<void> {
  return (await fetch(`/api/catalyst-pointers`)).json()
}
