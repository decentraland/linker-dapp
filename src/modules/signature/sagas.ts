import { call, put, takeLatest, takeEvery, select } from 'redux-saga/effects'
import { getConnectedProvider } from 'decentraland-dapps/dist/lib/eth'
import {
  getAddress,
  getChainId
} from 'decentraland-dapps/dist/modules/wallet/selectors'
import { Web3Provider } from '@ethersproject/providers'
import { toUtf8Bytes } from '@ethersproject/strings'
import { ChainId } from '@dcl/schemas'
import { Bytes, hexlify } from '@ethersproject/bytes'

import { closeServer } from '../server/utils'
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
import { Wallet } from '@ethersproject/wallet'
import { Authenticator, AuthIdentity } from 'dcl-crypto'

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
    yield call(() => {
      // tslint:disable-next-line: no-floating-promises
      closeServer(true, {
        responseType: 'scene-deploy',
        payload: { signature, address, chainId }
      })
    })
  } catch (error) {
    yield put(signContentFailure((error as Error).message))
  }
}

function* handleCreateIdentityRequest(_action: SignContentRequestAction) {
  try {
    const provider: Provider = yield call(() => getConnectedProvider())
    const web3provider = new Web3Provider(provider)
    const signer = web3provider.getSigner()

    const address: string = yield call(() => signer.getAddress())
    const randomWallet = Wallet.createRandom()
    const payload = {
      address: randomWallet.address,
      privateKey: randomWallet.privateKey,
      publicKey: randomWallet.publicKey
    }

    const identity: AuthIdentity = yield call(() =>
      Authenticator.initializeAuthChain(
        address,
        payload,
        1000,
        async (message: string | Bytes) => {
          const dataToSign =
            typeof message === 'string' ? toUtf8Bytes(message) : message
          const signedMessage: string = (await provider.send('personal_sign', [
            hexlify(dataToSign),
            address.toLowerCase()
          ])) as string
          return signedMessage
        }
      )
    )

    console.log({ identity })

    yield put(createIdentitySuccess(identity))
  } catch (error) {
    console.log({ error })
    yield put(createIdentityFailure((error as Error).message))
  }
}

function* handleCreateIdentitySuccess(action: CreateIdentitySuccessAction) {
  const { identity } = action.payload
  const address: string = yield select(getAddress)
  const chainId: ChainId = yield select(getChainId)

  try {
    yield call(() => {
      // tslint:disable-next-line: no-floating-promises
      closeServer(true, { responseType: 'identity', payload: { identity, address , chainId} })
    })
  } catch (error) {
    yield put(signContentFailure((error as Error).message))
  }
}
