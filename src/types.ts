import { Reducer, Store } from 'redux'
import { StorageState } from 'decentraland-dapps/dist/modules/storage/reducer'
import { WalletState } from 'decentraland-dapps/dist/modules/wallet/reducer'
import { TransactionState } from 'decentraland-dapps/dist/modules/transaction/reducer'
import { TranslationState } from 'decentraland-dapps/dist/modules/translation/reducer'

import { SignatureState } from './modules/signature/reducer'
import { AuthorizationState } from './modules/authorization/reducer'
import { ApiState } from './modules/server/reducer'

export type RootState = {
  storage: StorageState
  wallet: WalletState
  transaction: TransactionState
  translation: TranslationState
  authorization: AuthorizationState
  signature: SignatureState
  api: ApiState
}

export type RootReducer = Reducer<Store<RootState>>
