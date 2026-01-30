import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { Info } from '../../modules/server/reducer'
import { SignLogsRequestAction } from '../../modules/signature/actions'

export type Props = {
  wallet: Partial<Wallet> | null
  isConnected: boolean
  isConnecting: boolean
  signed: boolean
  isSigning: boolean
  info?: Info
  error?: string | null
  onSignContent: (cid: string) => SignLogsRequestAction
  onFetchInfo: () => void
}

export type MapStateProps = Pick<
  Props,
  | 'wallet'
  | 'isConnected'
  | 'isConnecting'
  | 'signed'
  | 'isSigning'
  | 'info'
  | 'error'
>

export type MapDispatchProps = Pick<Props, 'onSignContent' | 'onFetchInfo'>
