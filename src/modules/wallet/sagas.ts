import { takeEvery, all, call } from 'redux-saga/effects'
import { createWalletSaga } from 'decentraland-dapps/dist/modules/wallet/sagas'
import { CHANGE_NETWORK, CHANGE_ACCOUNT } from 'decentraland-dapps/dist/modules/wallet/actions'

import { getChainId } from '../../config'

export function* walletSaga() {
  const baseWalletSaga = createWalletSaga({
    CHAIN_ID: getChainId()
  })
  yield all([baseWalletSaga(), fullWalletSaga()])
}

function* fullWalletSaga() {
  yield takeEvery(CHANGE_NETWORK, handleWallet)
  yield takeEvery(CHANGE_ACCOUNT, handleWallet)
}

function* handleWallet() {
  yield call(() => window.location.reload())
}
