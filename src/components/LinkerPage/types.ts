import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { Transaction } from 'decentraland-dapps/dist/modules/transaction/types'

import { SignContentRequestAction } from '../../modules/signature/actions'
import { Authorization } from '../../modules/authorization/types'
import { Info } from '../../modules/server/reducer'

export type Props = {
  sceneOwner?: string
  wallet: Partial<Wallet> | null
  transaction?: Transaction
  isConnected: boolean
  isConnecting: boolean
  isSigning: boolean
  signed: boolean
  isUpdateAuthorized: boolean
  authorizations: Authorization[]
  isAuthorizationLoading: boolean
  onFetchInfo: () => void
  info?: Info
  onSignContent: (cid: string) => SignContentRequestAction
  onFetchFiles: () => void
  deployError?: string | null
}

export type MapStateProps = Pick<
  Props,
  | 'wallet'
  | 'isConnected'
  | 'isConnecting'
  | 'signed'
  | 'isUpdateAuthorized'
  | 'authorizations'
  | 'isAuthorizationLoading'
  | 'isSigning'
  | 'info'
  | 'deployError'
>
export type MapDispatchProps = Pick<
  Props,
  'onSignContent' | 'onFetchFiles' | 'onFetchInfo'
>
