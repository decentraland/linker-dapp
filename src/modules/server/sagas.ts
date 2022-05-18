import { takeEvery, call, put } from 'redux-saga/effects'

import {
  fetchFilesFailure,
  fetchFilesSuccess,
  FETCH_FILES_REQUEST
} from './actions'
import { FileSize } from './reducer'
import { getFiles } from './utils'

export function* apiSaga() {
  yield takeEvery(FETCH_FILES_REQUEST, handleFetchFilesRequest)
}

function* handleFetchFilesRequest() {
  try {
    const files: FileSize[] = yield call(getFiles)
    yield put(fetchFilesSuccess(files))
  } catch (e) {
    yield put(fetchFilesFailure((e as any).message))
  }
}
