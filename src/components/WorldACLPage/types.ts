import { enableWalletRequest } from 'decentraland-dapps/dist/modules/wallet/actions'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { fetchInfoRequest } from '../../modules/acl/actions'
import { InfoResponse } from '../../modules/acl/types'
import { SignWorldACLRequestAction } from '../../modules/signature/actions'

export type Props = {
  wallet: Partial<Wallet>
  isConnected: boolean
  isConnecting: boolean
  isSigning: boolean
  signed: boolean
  info?: InfoResponse
  onConnectWallet: typeof enableWalletRequest
  onFetchInfo: typeof fetchInfoRequest
  onSignContent: (payload: string) => SignWorldACLRequestAction
}

export type MapStateProps = Pick<
  Props,
  'wallet' | 'isConnected' | 'isConnecting' | 'signed' | 'isSigning' | 'info'
>
export type MapDispatchProps = Pick<
  Props,
  'onConnectWallet' | 'onSignContent' | 'onFetchInfo'
>
