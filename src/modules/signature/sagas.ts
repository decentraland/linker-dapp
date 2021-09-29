import { call, put, takeLatest, takeEvery, select } from 'redux-saga/effects'
import { getConnectedProvider } from 'decentraland-dapps/dist/lib/eth'
import {
  getAddress,
  getChainId,
} from 'decentraland-dapps/dist/modules/wallet/selectors'
import { Web3Provider } from '@ethersproject/providers'
import { toUtf8Bytes } from '@ethersproject/strings'
import { ChainId } from '@dcl/schemas'
import { hexlify } from '@ethersproject/bytes'

import { closeServer } from '../server/utils'
import {
  SIGN_CONTENT_REQUEST,
  SIGN_CONTENT_SUCCESS,
  SignContentRequestAction,
  signContentSuccess,
  signContentFailure,
  SignContentSuccessAction
} from './actions'
import { Provider } from 'decentraland-connect/dist'

export function* signatureSaga() {
  yield takeLatest(SIGN_CONTENT_REQUEST, handleSignContentRequest)
  yield takeEvery(SIGN_CONTENT_SUCCESS, handleSignContentSuccess)
}

function* handleSignContentRequest(action: SignContentRequestAction) {
  try {
    const dataToSign = toUtf8Bytes(action.payload)

    const provider: Provider = yield call(() => getConnectedProvider())
    const web3provider = new Web3Provider(provider)
    const signer = web3provider.getSigner()

    const addr: string = yield call(() => signer.getAddress())

    const signedMessage: string = yield call(() =>
      provider.send('personal_sign', [hexlify(dataToSign), addr.toLowerCase()])
    )
    yield put(signContentSuccess(signedMessage))
  } catch (error) {
    yield put(signContentFailure((error as Error).message))
  }
}

function* handleSignContentSuccess(action: SignContentSuccessAction) {
  const address: string = yield select(getAddress)
  const chainId: ChainId = yield select(getChainId)
  const { signature } = action.payload

  try {
    yield call(() => {
      // tslint:disable-next-line: no-floating-promises
      closeServer(true, { signature, address, chainId })
    })
  } catch (error) {
    yield put(signContentFailure((error as Error).message))
  }
}
