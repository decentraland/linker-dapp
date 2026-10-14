import { ChainId } from '@dcl/schemas'
import { AuthChain, AuthIdentity } from '@dcl/crypto'
import { DeployState, InfoResponse } from './types'

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

function isDeployState(value: unknown): value is DeployState {
  return (
    !!value &&
    typeof value === 'object' &&
    typeof (value as DeployState).phase === 'string'
  )
}

async function readDeployState(response: Response): Promise<DeployState> {
  const body: unknown = await response.json().catch(() => undefined)
  if (!isDeployState(body)) {
    throw new Error('Unexpected deployment state received from the CLI')
  }
  return body
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
    return
  }
  const error = (await response.json()).message as string
  throw new Error(error)
}

/** Resolves with undefined when the CLI does not expose the deployment state. */
export async function getDeployStateRequest(): Promise<DeployState | undefined> {
  const response = await fetch(DEPLOY_URL, {
    headers: { Accept: 'application/json' },
  })
  if (response.status === 404) {
    return
  }
  if (!response.ok) {
    throw new Error(`Could not get the deployment state (${response.status})`)
  }
  return readDeployState(response)
}

export async function deleteDeploy(): Promise<DeployState> {
  const response = await fetch(DEPLOY_URL, { method: 'delete' })
  if (response.status === 202 || response.status === 409) {
    return readDeployState(response)
  }
  const body = await response.json().catch(() => ({}))
  throw new Error(
    (body as { message?: string }).message ||
      `Could not cancel the deployment (${response.status})`,
  )
}

/**
 * Follows the deployment state through server-sent events. Returns a function
 * that closes the stream.
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
    let state: unknown
    try {
      state = JSON.parse((event as MessageEvent<string>).data)
    } catch {
      state = undefined
    }
    if (isDeployState(state)) {
      onState(state)
    } else {
      onError()
    }
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
