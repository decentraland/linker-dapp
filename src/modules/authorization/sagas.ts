import { call, put, takeEvery, select } from 'redux-saga/effects'
import { CONNECT_WALLET_SUCCESS } from 'decentraland-dapps/dist/modules/wallet/actions'
import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'

import { getLandContract, getEstateContract } from '../../contracts'
import { getConfig } from '../../config'
import { coordsToString } from '../land/utils'
import {
  FETCH_AUTHORIZATIONS_REQUEST,
  fetchAuthorizationsRequest,
  fetchAuthorizationsFailure,
  fetchAuthorizationsSuccess
} from './actions'
import { Authorization } from './types'
import { Contract } from '@ethersproject/contracts'

export function* authorizationSaga() {
  yield takeEvery(CONNECT_WALLET_SUCCESS, handleConnectWalletSuccess)
  yield takeEvery(
    FETCH_AUTHORIZATIONS_REQUEST,
    handleFetchAuthorizationsRequest
  )
}

function* handleFetchAuthorizationsRequest() {
  const LANDRegistry: Contract = yield call(() => getLandContract())
  const EstateRegistry: Contract = yield call(() => getEstateContract())

  try {
    const address: string = yield select(getAddress)
    const assetIds = new Map<string, string>()

    const pAuthorizations: Promise<unknown>[] = []
    for (const parcel of getConfig('parcels')) {
      const { x, y } = parcel
      const pAuthorization = new Promise((resolve, reject) => {
        LANDRegistry['encodeTokenId'](x, y)
          .then((assetId: any) => {
            LANDRegistry['isUpdateAuthorized'](address, assetId)
              .then((isUpdateAuthorized: any) => {
                assetIds.set(coordsToString(parcel), assetId)
                resolve({ x, y, isUpdateAuthorized })
              })
              .catch(reject)
          })
          .catch(reject)
      })
      pAuthorizations.push(pAuthorization)
    }

    const parcelAuthorizations: Authorization[] = yield call(() =>
      Promise.all(pAuthorizations)
    )

    // If not authorized check permissions on estate
    const notAllowedAuthorizations = parcelAuthorizations.filter(
      a => !a.isUpdateAuthorized
    )
    const allowedAuthorizations = parcelAuthorizations.filter(
      a => a.isUpdateAuthorized
    )

    const pEstateAuthorizations: unknown[] = []
    for (const a of notAllowedAuthorizations) {
      const assetId = assetIds.get(coordsToString(a))
      const pAuthorization = new Promise((resolve, reject) => {
        EstateRegistry['getLandEstateId'](assetId)
          .then((estate: any) => {
            if (estate && estate > 0) {
              return EstateRegistry['isUpdateAuthorized'](address, estate).then(
                (isUpdateAuthorized: any) => {
                  resolve({ ...a, isUpdateAuthorized })
                }
              )
            } else {
              return resolve(a) // If no estate leave authorization in false
            }
          })
          .catch(reject)
      })
      pEstateAuthorizations.push(pAuthorization)
    }

    const estateAuthorizations: Authorization[] = yield call(() =>
      Promise.all(pEstateAuthorizations)
    )

    const authorizations = [...allowedAuthorizations, ...estateAuthorizations]
    yield put(fetchAuthorizationsSuccess(authorizations))
  } catch (error) {
    yield put(fetchAuthorizationsFailure((error as Error).message))
  }
}

function* handleConnectWalletSuccess(): any {
  const address = yield call(() => getAddress)
  yield put(fetchAuthorizationsRequest(address))
}
