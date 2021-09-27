import { takeEvery, all, put } from 'redux-saga/effects'
import { createWalletSaga } from 'decentraland-dapps/dist/modules/wallet/sagas'
import {
  CHANGE_NETWORK,
  disconnectWallet
} from 'decentraland-dapps/dist/modules/wallet/actions'

import { getConfig } from '../../config'

export function* walletSaga() {
  const baseWalletSaga = createWalletSaga({
    CHAIN_ID: getConfig('chainId')
  })
  yield all([baseWalletSaga(), fullWalletSaga()])
}

function* fullWalletSaga() {
  yield takeEvery(CHANGE_NETWORK, handleWallet)
}

function* handleWallet() {
  yield put(disconnectWallet())
  window.location.reload()
}
