import { Reducer, Store } from 'redux'
import { WalletState } from 'decentraland-dapps/dist/modules/wallet/reducer'
import { TransactionState } from 'decentraland-dapps/dist/modules/transaction/reducer'

import { LandState } from './modules/land/reducer'
import { SignatureState } from './modules/signature/reducer'
import { AuthorizationState } from './modules/authorization/reducer'

export type RootState = {
  wallet: WalletState
  transaction: TransactionState
  land: LandState
  authorization: AuthorizationState
  signature: SignatureState
}

export type RootReducer = Reducer<Store<RootState>>
