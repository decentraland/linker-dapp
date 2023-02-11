import { takeEvery, all, call, select, put } from 'redux-saga/effects'
import { ChainId } from '@dcl/schemas'
import { createWalletSaga } from 'decentraland-dapps/dist/modules/wallet/sagas'
import {
  CHANGE_NETWORK,
  CHANGE_ACCOUNT,
  CONNECT_WALLET_SUCCESS,
} from 'decentraland-dapps/dist/modules/wallet/actions'
import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { config } from '../../config'
import { fetchAuthorizationsRequest } from '../authorization/actions'

export function* walletSaga() {
  const baseWalletSaga = createWalletSaga({
    CHAIN_ID: config.get('CHAIN_ID', ChainId.ETHEREUM_MAINNET.toString()),
  })
  yield all([baseWalletSaga(), fullWalletSaga()])
}

function* fullWalletSaga() {
  yield takeEvery(CHANGE_NETWORK, handleWallet)
  yield takeEvery(CHANGE_ACCOUNT, handleWallet)
  yield takeEvery(CONNECT_WALLET_SUCCESS, handleConnectWalletSuccess)
}

function* handleWallet() {
  yield call(() => window.location.reload())
}

function* handleConnectWalletSuccess() {
  const address: string = yield select(getAddress)
  yield put(fetchAuthorizationsRequest(address))
}
