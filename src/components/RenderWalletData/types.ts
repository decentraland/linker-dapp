import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { Authorization } from '../../modules/authorization/types'
import { EnableWalletRequestAction } from 'decentraland-dapps/dist/modules/wallet/actions'

export type Props = {
  wallet: Partial<Wallet>
  isConnecting: boolean
  isConnected: boolean
  isUpdateAuthorized: boolean
  authorizations: Authorization[]
  onConnectWallet: () => EnableWalletRequestAction
}
