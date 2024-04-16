import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { takeEvery, call, put, select } from 'redux-saga/effects'

import {
  fetchWorldACLSuccess,
  fetchInfoFailure,
  fetchInfoSuccess,
  FetchWorldACLRequestAction,
  fetchWorldACLFailure,
  FETCH_WORLD_ACL_REQUEST,
  FETCH_INFO_REQUEST,
  DELETE_WORLD_ACL_REQUEST,
  PUT_WORLD_ACL_REQUEST,
  DeleteWorldACLRequestAction,
  PutWorldACLRequestAction,
  deleteWorldACLFailure,
  deleteWorldACLSuccess,
  putWorldACLFailure,
  putWorldACLSuccess,
} from './actions'
import { WorldPermissionsResponse } from './reducer'
import { InfoResponse } from './types'
import { getWorldACL, getInfoRequest, updateWorldACL } from './utils'

export function* aclSaga() {
  yield takeEvery(FETCH_INFO_REQUEST, handleFetchInfoRequest)
  yield takeEvery(FETCH_WORLD_ACL_REQUEST, handleFetchWorldACLRequest)
  yield takeEvery(PUT_WORLD_ACL_REQUEST, handlePutWorldACLRequest)
  yield takeEvery(DELETE_WORLD_ACL_REQUEST, handleDeleteWorldACLRequest)
}

function* handleFetchInfoRequest() {
  try {
    const info: InfoResponse = yield call(getInfoRequest)
    yield put(fetchInfoSuccess(info))
  } catch (e) {
    yield put(fetchInfoFailure((e as any).message))
  }
}

function* handleFetchWorldACLRequest(action: FetchWorldACLRequestAction) {
  const { targetContent, worldName } = action.payload
  try {
    const acl: WorldPermissionsResponse = yield call(getWorldACL, targetContent, worldName)
    yield put(fetchWorldACLSuccess(acl, worldName))
  } catch (e) {
    yield put(fetchWorldACLFailure((e as any).message))
  }
}

function* handlePutWorldACLRequest(action: PutWorldACLRequestAction) {
  const { signature } = action.payload

  const address: string = yield select(getAddress)

  try {
    yield call(updateWorldACL, { signature, address }, 'put')
    yield put(putWorldACLSuccess())
  } catch (e) {
    yield put(putWorldACLFailure((e as any).message))
  }
}

function* handleDeleteWorldACLRequest(action: DeleteWorldACLRequestAction) {
  const { signature } = action.payload

  const address: string = yield select(getAddress)

  try {
    yield call(updateWorldACL, { signature, address }, 'delete')
    yield put(deleteWorldACLSuccess())
  } catch (e) {
    yield put(deleteWorldACLFailure((e as any).message))
  }
}
