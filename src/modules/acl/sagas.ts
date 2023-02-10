import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { takeEvery, call, put, select } from 'redux-saga/effects'

import {
  fetchWorldACLSuccess,
  fetchInfoFailure,
  fetchInfoSuccess,
  FETCH_WORLD_ACL_REQUEST,
  FETCH_INFO_REQUEST,
  FetchWorldACLRequestAction,
  fetchWorldACLFailure,
  UpdateWorldACLRequestAction,
  UPDATE_WORLD_ACL_REQUEST,
  updateWorldACLFailure,
  updateWorldACLSuccess,
} from './actions'
import { ACLResponse } from './reducer'
import { InfoResponse } from './types'
import { getWorldACL, getInfoRequest, updateWorldACL } from './utils'

export function* aclSaga() {
  yield takeEvery(FETCH_INFO_REQUEST, handleFetchInfoRequest)
  yield takeEvery(FETCH_WORLD_ACL_REQUEST, handleFetchWorldACLRequest)
  yield takeEvery(UPDATE_WORLD_ACL_REQUEST, handleUpdateWorldACLRequest)
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
  const { targetServer, worldName } = action.payload
  try {
    const acl: ACLResponse = yield call(getWorldACL, targetServer, worldName)
    yield put(fetchWorldACLSuccess(acl))
  } catch (e) {
    yield put(fetchWorldACLFailure((e as any).message))
  }
}

function* handleUpdateWorldACLRequest(action: UpdateWorldACLRequestAction) {
  const { signature } = action.payload

  const address: string = yield select(getAddress)

  try {
    yield call(updateWorldACL, { signature, address })
    yield put(updateWorldACLSuccess())
  } catch (e) {
    yield put(updateWorldACLFailure((e as any).message))
  }
}
