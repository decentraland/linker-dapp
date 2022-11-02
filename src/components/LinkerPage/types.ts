import { enableWalletRequest } from 'decentraland-dapps/dist/modules/wallet/actions'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { Transaction } from 'decentraland-dapps/dist/modules/transaction/types'

import { LANDMeta } from '../../modules/land/types'
import { SignContentRequestAction } from '../../modules/signature/actions'
import { Authorization } from '../../modules/authorization/types'
import { Info } from '../../modules/server/reducer'

export type Props = {
  sceneOwner?: string
  base: LANDMeta
  wallet: Partial<Wallet>
  transaction?: Transaction
  isLandLoading: boolean
  isConnected: boolean
  isConnecting: boolean
  isSigning: boolean
  error: string
  signed: boolean
  isUpdateAuthorized: boolean
  authorizations: Authorization[]
  isAuthorizationLoading: boolean
  onConnectWallet: typeof enableWalletRequest
  onFetchInfo: () => void
  info?: Info
  onSignContent: (cid: string) => SignContentRequestAction
  onFetchFiles: () => void
}

export type MapStateProps = Pick<
  Props,
  | 'base'
  | 'wallet'
  | 'isLandLoading'
  | 'isConnected'
  | 'isConnecting'
  | 'error'
  | 'signed'
  | 'isUpdateAuthorized'
  | 'authorizations'
  | 'isAuthorizationLoading'
  | 'isSigning'
  | 'info'
>
export type MapDispatchProps = Pick<Props, 'onConnectWallet' | 'onSignContent' | 'onFetchFiles' | 'onFetchInfo'>
