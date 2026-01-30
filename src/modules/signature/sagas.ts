import { call, put, takeLatest, takeEvery, select } from 'redux-saga/effects'
import { Web3Provider } from '@ethersproject/providers'
import { getConnectedProvider } from 'decentraland-dapps/dist/lib/eth'
import {
  getAddress,
  getChainId,
} from 'decentraland-dapps/dist/modules/wallet/selectors'
import { Provider } from 'decentraland-connect'
import { AuthChain, Authenticator, AuthIdentity } from '@dcl/crypto'
import { createIdentity } from '@dcl/builder-client'
import { ChainId } from '@dcl/schemas'
import { closeServer, postDeploy, postStorage, postLogs } from '../server/utils'
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
  SIGN_STORAGE_REQUEST,
  SIGN_STORAGE_SUCCESS,
  SignStorageRequestAction,
  signStorageSuccess,
  signStorageFailure,
  SignStorageSuccessAction,
  SIGN_LOGS_REQUEST,
  SIGN_LOGS_SUCCESS,
  SignLogsRequestAction,
  signLogsSuccess,
  signLogsFailure,
  SignLogsSuccessAction,
} from './actions'
import { putWorldACLRequest, deleteWorldACLRequest } from '../acl/actions'
import { signQuestsFetchRequest } from '../quests/action'
import { getIdentity } from '../wallet/selectors'

export function* signatureSaga() {
  yield takeLatest(SIGN_CONTENT_REQUEST, handleSignContentRequest)
  yield takeEvery(SIGN_CONTENT_SUCCESS, handleSignContentSuccess)

  yield takeLatest(CREATE_IDENTITY_REQUEST, handleCreateIdentityRequest)
  yield takeLatest(CREATE_IDENTITY_SUCCESS, handleCreateIdentitySuccess)

  yield takeLatest(SIGN_PUT_WORLD_ACL_REQUEST, handleSignWorldACLRequest)
  yield takeEvery(SIGN_PUT_WORLD_ACL_SUCCESS, handleSignPutWorldACLSuccess)

  yield takeLatest(SIGN_DELETE_WORLD_ACL_REQUEST, handleSignWorldACLRequest)
  yield takeEvery(
    SIGN_DELETE_WORLD_ACL_SUCCESS,
    handleSignDeleteWorldACLSuccess,
  )

  yield takeLatest(SIGN_QUESTS_REQUEST, handleQuestsSignRequest)
  yield takeEvery(SIGN_QUESTS_SUCCESS, handleQuestsSignSuccess)

  yield takeLatest(SIGN_STORAGE_REQUEST, handleSignStorageRequest)
  yield takeEvery(SIGN_STORAGE_SUCCESS, handleSignStorageSuccess)

  yield takeLatest(SIGN_LOGS_REQUEST, handleSignLogsRequest)
  yield takeEvery(SIGN_LOGS_SUCCESS, handleSignLogsSuccess)
}

function* sign(
  action:
    | SignContentRequestAction
    | SignPutWorldACLRequestAction
    | SignDeleteWorldACLRequestAction
    | SignQuestsRequestAction
    | SignStorageRequestAction
    | SignLogsRequestAction,
) {
  const identity: AuthIdentity | undefined = yield select(getIdentity)
  if (!identity) {
    throw new Error('No identity found')
  }

  return Authenticator.signPayload(identity, action.payload)
}

function* handleSignContentRequest(action: SignContentRequestAction) {
  try {
    const authChain: AuthChain = yield call(sign, action)
    yield put(signContentSuccess(authChain))
  } catch (error) {
    yield put(signContentFailure((error as Error).message))
  }
}

function* handleSignContentSuccess(action: SignContentSuccessAction) {
  const address: string = yield select(getAddress)
  const chainId: ChainId = yield select(getChainId)
  const { authChain } = action.payload

  try {
    yield call(postDeploy, { authChain, address, chainId })
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
      createIdentity(signer, 1000),
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

function* handleSignWorldACLRequest(
  action: SignPutWorldACLRequestAction | SignDeleteWorldACLRequestAction,
) {
  try {
    const authChain: AuthChain = yield call(sign, action)

    if (action.type === SIGN_PUT_WORLD_ACL_REQUEST) {
      yield put(signPutWorldACLSuccess(authChain))
    }
    if (action.type === SIGN_DELETE_WORLD_ACL_REQUEST) {
      yield put(signPutWorldACLSuccess(authChain))
    }
  } catch (error) {
    if (action.type === SIGN_PUT_WORLD_ACL_REQUEST) {
      yield put(signPutWorldACLFailure((error as Error).message))
    }
    if (action.type === SIGN_DELETE_WORLD_ACL_REQUEST) {
      yield put(signPutWorldACLFailure((error as Error).message))
    }
  }
}

function* handleSignPutWorldACLSuccess(action: SignPutWorldACLSuccessAction) {
  const { authChain } = action.payload
  yield put(putWorldACLRequest(authChain))
}

function* handleSignDeleteWorldACLSuccess(
  action: SignDeleteWorldACLSuccessAction,
) {
  const { authChain } = action.payload
  yield put(deleteWorldACLRequest(authChain))
}

function* handleQuestsSignRequest(action: SignQuestsRequestAction) {
  try {
    const authChain: AuthChain = yield call(sign, action)
    yield put(signQuestsSuccess(authChain))
  } catch (error) {
    yield put(signQuestsFailure((error as Error).message))
  }
}

function* handleQuestsSignSuccess(action: SignQuestsSuccessAction) {
  const { authChain } = action.payload
  yield put(signQuestsFetchRequest(authChain))
}

function* handleSignStorageRequest(action: SignStorageRequestAction) {
  try {
    const authChain: AuthChain = yield call(sign, action)
    yield put(signStorageSuccess(authChain))
  } catch (error) {
    yield put(signStorageFailure((error as Error).message))
  }
}

function* handleSignStorageSuccess(action: SignStorageSuccessAction) {
  const address: string = yield select(getAddress)
  const chainId: ChainId = yield select(getChainId)
  const { authChain } = action.payload

  try {
    yield call(postStorage, { authChain, address, chainId })
  } catch (error) {
    yield put(signStorageFailure((error as Error).message))
  }
}

function* handleSignLogsRequest(action: SignLogsRequestAction) {
  try {
    const authChain: AuthChain = yield call(sign, action)
    yield put(signLogsSuccess(authChain))
  } catch (error) {
    yield put(signLogsFailure((error as Error).message))
  }
}

function* handleSignLogsSuccess(action: SignLogsSuccessAction) {
  const address: string = yield select(getAddress)
  const chainId: ChainId = yield select(getChainId)
  const { authChain } = action.payload

  try {
    yield call(postLogs, { authChain, address, chainId })
  } catch (error) {
    yield put(signLogsFailure((error as Error).message))
  }
}
