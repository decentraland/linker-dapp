import { call, put, takeLatest, takeEvery, select } from 'redux-saga/effects'
import { getConnectedProvider } from 'decentraland-dapps/dist/lib/eth'
import { getAddress, getChainId } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { Web3Provider } from '@ethersproject/providers'
import { toUtf8Bytes } from '@ethersproject/strings'
import { ChainId } from '@dcl/schemas'
import { hexlify } from '@ethersproject/bytes'
import { closeServer, postDeploy } from '../server/utils'
import {
  SIGN_CONTENT_REQUEST,
  SIGN_CONTENT_SUCCESS,
  SignContentRequestAction,
  signContentSuccess,
  signContentFailure,
  SignContentSuccessAction,
  CREATE_IDENTITY_REQUEST,
  createIdentitySuccess,
  createIdentityFailure,
  CREATE_IDENTITY_SUCCESS,
  CreateIdentitySuccessAction
} from './actions'
import { Provider } from 'decentraland-connect/dist'
import { AuthIdentity } from 'dcl-crypto'
import { createIdentity } from '@dcl/builder-client'
import { fetchCatalystRequest } from '../server/actions'

export function* signatureSaga() {
  yield takeLatest(SIGN_CONTENT_REQUEST, handleSignContentRequest)
  yield takeEvery(SIGN_CONTENT_SUCCESS, handleSignContentSuccess)

  yield takeLatest(CREATE_IDENTITY_REQUEST, handleCreateIdentityRequest)
  yield takeLatest(CREATE_IDENTITY_SUCCESS, handleCreateIdentitySuccess)
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
    yield call(postDeploy, { signature, address, chainId })
  } catch (error) {
    yield put(signContentFailure((error as Error).message))
  }
}

function* handleCreateIdentityRequest(_action: SignContentRequestAction) {
  try {
    const provider: Provider = yield call(() => getConnectedProvider())
    const web3provider = new Web3Provider(provider)
    const signer = web3provider.getSigner()
    const identity: AuthIdentity = yield call(() => createIdentity(signer, 1000))
    yield put(createIdentitySuccess(identity))
    yield put(fetchCatalystRequest())
  } catch (error) {
    yield put(createIdentityFailure((error as Error).message))
  }
}

function* handleCreateIdentitySuccess(action: CreateIdentitySuccessAction) {
  const { identity } = action.payload
  const address: string = yield select(getAddress)
  const chainId: ChainId = yield select(getChainId)

  try {
    yield call(closeServer, true, {
      responseType: 'identity',
      payload: { identity, address, chainId }
    })
  } catch (error) {
    yield put(signContentFailure((error as Error).message))
  }
}
