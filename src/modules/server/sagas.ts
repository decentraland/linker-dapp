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
} from './actions'
import { CatalystResponse, FileSize } from './reducer'
import { DeployState, InfoResponse, isFinalDeployPhase } from './types'
import {
  deleteDeploy,
  getCatalystsPointer,
  getDeployStateRequest,
  getFilesRequest,
  getInfoRequest,
  subscribeToDeployState,
} from './utils'

export const DEPLOY_STATE_POLLING_INTERVAL = 1000

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
    const state: DeployState = yield call(deleteDeploy)
    yield put(cancelDeploySuccess(state))
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
 * polling. Resolves with the final state, or with undefined when the CLI does
 * not expose the deployment state.
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

  while (true) {
    const state: DeployState | undefined = yield call(getDeployStateRequest)
    if (!state) {
      yield put(updateDeployState(null))
      return undefined
    }
    yield put(updateDeployState(state))
    if (isFinalDeployPhase(state.phase)) {
      return state
    }
    yield delay(DEPLOY_STATE_POLLING_INTERVAL)
  }
}
