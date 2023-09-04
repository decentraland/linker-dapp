import { combineReducers } from 'redux'
import { walletReducer as wallet } from 'decentraland-dapps/dist/modules/wallet/reducer'
import { transactionReducer as transaction } from 'decentraland-dapps/dist/modules/transaction/reducer'
import { translationReducer as translation } from 'decentraland-dapps/dist/modules/translation/reducer'
import {
  storageReducer as storage,
  storageReducerWrapper,
} from 'decentraland-dapps/dist/modules/storage/reducer'

import { signatureReducer as signature } from './modules/signature/reducer'
import { authorizationReducer as authorization } from './modules/authorization/reducer'
import { apiReducer as api } from './modules/server/reducer'
import { aclReducer as acl } from './modules/acl/reducer'
import { questsReducer as quests } from './modules/quests/reducer'
import { RootState } from './types'

export const rootReducer = storageReducerWrapper(
  combineReducers<RootState>({
    storage,
    wallet,
    transaction,
    translation,
    signature,
    authorization,
    api,
    acl,
    quests
  })
)
