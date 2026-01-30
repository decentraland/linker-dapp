import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { Info } from '../../modules/server/reducer'

export type Props = {
  wallet: Partial<Wallet> | null
  isConnected: boolean
  isConnecting: boolean
  signed: boolean
  isSigning: boolean
  info?: Info
  error?: string | null
  onSignContent: (cid: string) => void
  onFetchInfo: () => void
}
