import { buffers, eventChannel, EventChannel } from 'redux-saga'
import { takeEvery, call, put, take, delay } from 'redux-saga/effects'

import {
  fetchCatalystFailure,
  fetchCatalystSuccess,
  fetchFilesFailure,
  fetchFilesSuccess,
  fetchInfoFailure,
  fetchInfoSuccess,
  FETCH_CATALYST_REQUEST,
  FETCH_FILES_REQUEST,
  FETCH_INFO_REQUEST,
  CANCEL_DEPLOY_REQUEST,
  cancelDeployFailure,
  cancelDeploySuccess,
  updateDeployState,
  deployOutcomeUnknown,
} from './actions'
import { CatalystResponse, FileSize } from './reducer'
import { DeployState, InfoResponse } from './types'
import { getDeployToken } from './deployToken'
import {
  deleteDeploy,
  getCatalystsPointer,
  getDeployStateRequest,
  getFilesRequest,
  getInfoRequest,
  isFinalDeployPhase,
  subscribeToDeployState,
} from './utils'

export const DEPLOY_STATE_POLLING_INTERVAL = 1000
export const DEPLOY_STATE_MAX_POLL_FAILURES = 5
export const DEPLOY_STATE_MAX_RETRY_DELAY = 8000

export const DEPLOY_STATE_UNAVAILABLE_MESSAGE =
  'Check the terminal for the deployment result'
export const DEPLOY_CONNECTION_LOST_MESSAGE =
  'Lost connection to the CLI — check the terminal for the result'

/** Backoff after the given number of consecutive failed polls: 1s, 2s, 4s, 8s. */
export function getPollRetryDelay(failures: number): number {
  return Math.min(
    DEPLOY_STATE_POLLING_INTERVAL * 2 ** (failures - 1),
    DEPLOY_STATE_MAX_RETRY_DELAY,
  )
}

type DeployStateEvent = { state: DeployState } | { error: true }

export function* apiSaga() {
  yield takeEvery(FETCH_FILES_REQUEST, handleFetchFilesRequest)
  yield takeEvery(FETCH_INFO_REQUEST, handleFetchInfoRequest)
  yield takeEvery(FETCH_CATALYST_REQUEST, handleFetchCatalystRequest)
  yield takeEvery(CANCEL_DEPLOY_REQUEST, handleCancelDeployRequest)
}

function* handleFetchFilesRequest() {
  try {
    const files: FileSize[] = yield call(getFilesRequest)
    yield put(fetchFilesSuccess(files))
  } catch (e) {
    yield put(fetchFilesFailure((e as any).message))
  }
}

function* handleFetchInfoRequest() {
  try {
    const info: InfoResponse = yield call(getInfoRequest)
    yield put(fetchInfoSuccess(info))
  } catch (e) {
    yield put(fetchInfoFailure((e as any).message))
  }
}

function* handleFetchCatalystRequest() {
  try {
    const value: CatalystResponse = yield call(getCatalystsPointer)
    yield put(fetchCatalystSuccess(value))
  } catch (e) {
    yield put(fetchCatalystFailure((e as any).message))
  }
}

function* handleCancelDeployRequest() {
  try {
    const token: string | null = yield call(getDeployToken)
    if (!token) {
      throw new Error("This page can't cancel the deployment")
    }
    const state: DeployState = yield call(deleteDeploy, token)
    yield put(updateDeployState(state))
    yield put(cancelDeploySuccess())
  } catch (e) {
    yield put(cancelDeployFailure((e as Error).message))
  }
}

export function createDeployStateChannel(): EventChannel<DeployStateEvent> {
  return eventChannel<DeployStateEvent>(
    (emit) =>
      subscribeToDeployState(
        (state) => emit({ state }),
        () => emit({ error: true }),
      ),
    buffers.expanding(),
  )
}

/**
 * Follows a deployment started in the background until it reaches a final
 * phase, keeping the store updated. Uses server-sent events and falls back to
 * polling, retrying failed polls with backoff. Resolves with the final state,
 * or with undefined when the deployment can't be followed until it ends.
 */
export function* followDeploy(initialState: DeployState) {
  yield put(updateDeployState(initialState))
  if (isFinalDeployPhase(initialState.phase)) {
    return initialState
  }

  const channel: EventChannel<DeployStateEvent> = yield call(
    createDeployStateChannel,
  )
  try {
    while (true) {
      const event: DeployStateEvent = yield take(channel)
      if (!('state' in event)) {
        break
      }
      yield put(updateDeployState(event.state))
      if (isFinalDeployPhase(event.state.phase)) {
        return event.state
      }
    }
  } finally {
    channel.close()
  }

  let failures = 0
  while (true) {
    let state: DeployState | undefined
    try {
      state = yield call(getDeployStateRequest)
    } catch {
      failures++
      if (failures >= DEPLOY_STATE_MAX_POLL_FAILURES) {
        yield put(deployOutcomeUnknown(DEPLOY_CONNECTION_LOST_MESSAGE))
        return undefined
      }
      yield delay(getPollRetryDelay(failures))
      continue
    }
    failures = 0
    if (!state) {
      yield put(updateDeployState(null))
      yield put(deployOutcomeUnknown(DEPLOY_STATE_UNAVAILABLE_MESSAGE))
      return undefined
    }
    yield put(updateDeployState(state))
    if (isFinalDeployPhase(state.phase)) {
      return state
    }
    yield delay(DEPLOY_STATE_POLLING_INTERVAL)
  }
}
