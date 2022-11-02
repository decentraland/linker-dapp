import { enableWalletRequest } from 'decentraland-dapps/dist/modules/wallet/actions'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { Transaction } from 'decentraland-dapps/dist/modules/transaction/types'

import { CreateIdentityRequestAction } from '../../modules/signature/actions'

export type Props = {
  wallet: Partial<Wallet>
  transaction?: Transaction
  isConnected: boolean
  isConnecting: boolean
  isSigning: boolean
  signed: boolean
  onConnectWallet: typeof enableWalletRequest
  onRequestIdentity: () => CreateIdentityRequestAction
}

export type MapStateProps = Pick<Props, 'wallet' | 'isConnected' | 'isConnecting' | 'signed' | 'isSigning'>
export type MapDispatchProps = Pick<Props, 'onConnectWallet' | 'onRequestIdentity'>
