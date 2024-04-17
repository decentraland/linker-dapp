import { call, put, takeLatest, takeEvery, select } from 'redux-saga/effects'
import { Web3Provider } from '@ethersproject/providers'
import { toUtf8Bytes } from '@ethersproject/strings'
import { hexlify } from '@ethersproject/bytes'
import { getConnectedProvider } from 'decentraland-dapps/dist/lib/eth'
import {
  getAddress,
  getChainId,
} from 'decentraland-dapps/dist/modules/wallet/selectors'
import { Provider } from 'decentraland-connect/dist'
import { AuthIdentity } from 'dcl-crypto'
import { createIdentity } from '@dcl/builder-client'
import { ChainId } from '@dcl/schemas'
import { closeServer, postDeploy } from '../server/utils'
import { deploySuccess, fetchCatalystRequest } from '../server/actions'
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
  CreateIdentitySuccessAction,
  CreateIdentityRequestAction,
  SIGN_QUESTS_REQUEST,
  SIGN_QUESTS_SUCCESS,
  SignQuestsRequestAction,
  signQuestsSuccess,
  signQuestsFailure,
  SignQuestsSuccessAction,
  SIGN_DELETE_WORLD_ACL_REQUEST,
  SIGN_DELETE_WORLD_ACL_SUCCESS,
  SIGN_PUT_WORLD_ACL_REQUEST,
  SIGN_PUT_WORLD_ACL_SUCCESS,
  SignDeleteWorldACLRequestAction,
  SignPutWorldACLRequestAction,
  SignDeleteWorldACLSuccessAction,
  SignPutWorldACLSuccessAction,
  signPutWorldACLSuccess,
  signPutWorldACLFailure,
} from './actions'
import { putWorldACLRequest, deleteWorldACLRequest } from '../acl/actions'
import { signQuestsFetchRequest } from '../quests/action'

export function* signatureSaga() {
  yield takeLatest(SIGN_CONTENT_REQUEST, handleSignContentRequest)
  yield takeEvery(SIGN_CONTENT_SUCCESS, handleSignContentSuccess)

  yield takeLatest(CREATE_IDENTITY_REQUEST, handleCreateIdentityRequest)
  yield takeLatest(CREATE_IDENTITY_SUCCESS, handleCreateIdentitySuccess)

  yield takeLatest(SIGN_PUT_WORLD_ACL_REQUEST, handleSignWorldACLRequest)
  yield takeEvery(SIGN_PUT_WORLD_ACL_SUCCESS, handleSignPutWorldACLSuccess)

  yield takeLatest(SIGN_DELETE_WORLD_ACL_REQUEST, handleSignWorldACLRequest)
  yield takeEvery(SIGN_DELETE_WORLD_ACL_SUCCESS, handleSignDeleteWorldACLSuccess)

  yield takeLatest(SIGN_QUESTS_REQUEST, handleQuestsSignRequest)
  yield takeEvery(SIGN_QUESTS_SUCCESS, handleQuestsSignSuccess)
}

function* sign(action: SignContentRequestAction | SignPutWorldACLRequestAction | SignDeleteWorldACLRequestAction | SignQuestsRequestAction) {
  const dataToSign = toUtf8Bytes(action.payload)

  const provider: Provider = yield call(() => getConnectedProvider())
  const web3provider = new Web3Provider(provider)
  const signer = web3provider.getSigner()

  const addr: string = yield call(() => signer.getAddress())

  const signedMessage: string = yield call(() =>
    provider.send('personal_sign', [hexlify(dataToSign), addr.toLowerCase()])
  )
  return signedMessage
}

function* handleSignContentRequest(action: SignContentRequestAction) {
  try {
    const signedMessage: string = yield call(sign, action)
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
    yield put(deploySuccess())
  } catch (error) {
    yield put(signContentFailure((error as Error).message))
  }
}

function* handleCreateIdentityRequest(_action: CreateIdentityRequestAction) {
  try {
    const provider: Provider = yield call(() => getConnectedProvider())
    const web3provider = new Web3Provider(provider)
    const signer = web3provider.getSigner()
    const identity: AuthIdentity = yield call(() =>
      createIdentity(signer, 1000)
    )
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
      payload: { identity, address, chainId },
    })
  } catch (error) {
    yield put(createIdentityFailure((error as Error).message))
  }
}

function* handleSignWorldACLRequest(action: SignPutWorldACLRequestAction | SignDeleteWorldACLRequestAction) {
  try {
    const signedMessage: string = yield call(sign, action)
    if(action.type === SIGN_PUT_WORLD_ACL_REQUEST) {
      yield put(signPutWorldACLSuccess(signedMessage))
    }
    if(action.type === SIGN_DELETE_WORLD_ACL_REQUEST) {
      yield put(signPutWorldACLSuccess(signedMessage))
    }
    
  } catch (error) {
    if(action.type === SIGN_PUT_WORLD_ACL_REQUEST) {
      yield put(signPutWorldACLFailure((error as Error).message))
    }
    if(action.type === SIGN_DELETE_WORLD_ACL_REQUEST) {
      yield put(signPutWorldACLFailure((error as Error).message))
    }
  }
}

function* handleSignPutWorldACLSuccess(action: SignPutWorldACLSuccessAction) {
  const { signature } = action.payload
  yield put(putWorldACLRequest(signature))
}

function* handleSignDeleteWorldACLSuccess(action: SignDeleteWorldACLSuccessAction) {
  const { signature } = action.payload
  yield put(deleteWorldACLRequest(signature))
}

function* handleQuestsSignRequest(action: SignQuestsRequestAction) {
  try {
    const signedMessage: string = yield call(sign, action)
    yield put(signQuestsSuccess(signedMessage))
  } catch (error) {
    yield put(signQuestsFailure((error as Error).message))
  }
}

function* handleQuestsSignSuccess(action: SignQuestsSuccessAction) {
  const { signature } = action.payload
  yield put(signQuestsFetchRequest(signature))
}
