import { combineReducers } from 'redux'
import { walletReducer as wallet } from 'decentraland-dapps/dist/modules/wallet/reducer'
import { transactionReducer as transaction } from 'decentraland-dapps/dist/modules/transaction/reducer'
import { translationReducer as translation } from 'decentraland-dapps/dist/modules/translation/reducer'
import { storageReducer as storage, storageReducerWrapper } from 'decentraland-dapps/dist/modules/storage/reducer'

import { landReducer as land } from './modules/land/reducer'
import { signatureReducer as signature } from './modules/signature/reducer'
import { authorizationReducer as authorization } from './modules/authorization/reducer'
import { apiReducer as api } from './modules/server/reducer'
import { RootState } from './types'

export const rootReducer = storageReducerWrapper(
  combineReducers<RootState>({
    storage,
    wallet,
    transaction,
    translation,
    land,
    signature,
    authorization,
    api
  })
)
