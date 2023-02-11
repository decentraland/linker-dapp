import { call, put, takeEvery, select, take } from 'redux-saga/effects'
import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'
import {
  FETCH_AUTHORIZATIONS_REQUEST,
  fetchAuthorizationsFailure,
  fetchAuthorizationsSuccess,
} from './actions'
import { Authorization } from './types'
import { Info } from '../server/reducer'
import { FETCH_INFO_SUCCESS } from '../server/actions'
import { getInfo } from '../server/selectors'
import { isAuthorized } from './utils'

export function* authorizationSaga() {
  yield takeEvery(
    FETCH_AUTHORIZATIONS_REQUEST,
    handleFetchAuthorizationsRequest
  )
}

function* handleFetchAuthorizationsRequest() {
  const info: Info = yield select(getInfo)

  if (!info) {
    yield take(FETCH_INFO_SUCCESS)
  }

  const qs = new URLSearchParams(document.location.search)

  const skipValidations = qs.get('skipValidations')
  if (skipValidations === 'true') {
    try {
      const { parcels } = info
      yield put(
        fetchAuthorizationsSuccess(
          parcels.map(({ x, y }) => ({
            x,
            y,
            isUpdateAuthorized: true,
          }))
        )
      )
    } catch (error) {
      yield put(fetchAuthorizationsFailure((error as Error).message))
    }
  } else {
    const { parcels, landRegistry, estateRegistry } = info

    try {
      const address: string = yield select(getAddress)
      const promises: Promise<Authorization>[] = parcels.map((parcel) =>
        isAuthorized(parcel.x, parcel.y, address, landRegistry, estateRegistry)
      )
      const authorizations: Authorization[] = yield call(() =>
        Promise.all(promises)
      )
      yield put(fetchAuthorizationsSuccess(authorizations))
    } catch (error) {
      yield put(fetchAuthorizationsFailure((error as Error).message))
    }
  }
}
