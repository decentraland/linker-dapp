import { call, put, takeEvery } from 'redux-saga/effects'
import { CONNECT_WALLET_SUCCESS } from 'decentraland-dapps/dist/modules/wallet/actions'
import * as CSV from 'comma-separated-values'

import { getConfig } from '../../config'
import { getLandContract } from '../../contracts'
import {
  FETCH_LAND_REQUEST,
  FetchLandRequestAction,
  fetchLandSuccess,
  fetchLandFailure,
  fetchLandRequest
} from './actions'
import { getEmptyLandData } from './utils'
import { Contract } from '@ethersproject/contracts'
import { LANDMeta } from './types'

export function* landSaga() {
  yield takeEvery(FETCH_LAND_REQUEST, handleFetchLandRequest)
  yield takeEvery(CONNECT_WALLET_SUCCESS, handleConnectWalletSuccess)
}

function* handleFetchLandRequest(action: FetchLandRequestAction) {
  const LANDRegistry: Contract = yield call(() => getLandContract())
  try {
    const { x, y } = action.payload
    const data: string = yield call(() => LANDRegistry['landData'](x, y))
    const land: LANDMeta = data
      ? yield call(() => decodeLandData(data))
      : getEmptyLandData()
    yield put(fetchLandSuccess(land))
  } catch (error) {
    yield put(fetchLandFailure((error as Error).message))
  }
}

function* handleConnectWalletSuccess() {
  yield put(fetchLandRequest(getConfig('baseParcel')))
}

function decodeLandData(data = '') {
  const version = data.charAt(0)
  switch (version) {
    case '0': {
      const [version, name, description, ipns] = CSV.parse(data, {
        cellDelimiter: ','
      })[0]

      return {
        version,
        // when a value is blank, csv.parse returns 0, so we fallback to empty string
        // to support stuff like `0,,,ipns:link`
        name: name || '',
        description: description || '',
        ipns: ipns || ''
      }
    }
    default:
      throw new Error(
        `Unknown version when trying to decode land data: "${data}"`
      )
  }
}
