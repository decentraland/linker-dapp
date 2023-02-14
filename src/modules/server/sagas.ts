import { takeEvery, call, put } from 'redux-saga/effects'

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
} from './actions'
import { CatalystResponse, FileSize } from './reducer'
import { InfoResponse } from './types'
import { getCatalystsPointer, getFilesRequest, getInfoRequest } from './utils'

export function* apiSaga() {
  yield takeEvery(FETCH_FILES_REQUEST, handleFetchFilesRequest)
  yield takeEvery(FETCH_INFO_REQUEST, handleFetchInfoRequest)
  yield takeEvery(FETCH_CATALYST_REQUEST, handleFetchCatalystRequest)
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
