import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { Info } from '../../modules/server/reducer'
import { SignStorageRequestAction } from '../../modules/signature/actions'

export type Props = {
  wallet: Partial<Wallet> | null
  isConnected: boolean
  isConnecting: boolean
  isSigning: boolean
  signed: boolean
  info?: Info
  error?: string | null
  onFetchInfo: () => void
  onSignContent: (cid: string) => SignStorageRequestAction
}

export type MapStateProps = Pick<
  Props,
  | 'wallet'
  | 'isConnected'
  | 'isConnecting'
  | 'isSigning'
  | 'signed'
  | 'info'
  | 'error'
>

export type MapDispatchProps = Pick<Props, 'onFetchInfo' | 'onSignContent'>
