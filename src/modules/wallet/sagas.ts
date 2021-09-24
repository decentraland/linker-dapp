import { takeEvery, all, put } from 'redux-saga/effects'
import { createWalletSaga } from 'decentraland-dapps/dist/modules/wallet/sagas'
import {
  CHANGE_ACCOUNT,
  SWITCH_NETWORK_REQUEST,
  CHANGE_NETWORK,
  FETCH_WALLET_FAILURE,
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
  yield takeEvery(CHANGE_ACCOUNT, handleWallet)
  yield takeEvery(CHANGE_NETWORK, handleWallet)
  yield takeEvery(SWITCH_NETWORK_REQUEST, handleWallet)
  yield takeEvery(FETCH_WALLET_FAILURE, handleWallet)
}

function* handleWallet() {
  yield put(disconnectWallet())
}
