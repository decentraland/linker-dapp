import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { QuestInfoResponse } from '../../modules/quests/types'
import { fetchQuestsInfoRequest } from '../../modules/quests/action'
import { SignQuestsRequestAction } from '../../modules/signature/actions'

export type Props = {
  wallet: Partial<Wallet> | null
  isConnected: boolean
  isConnecting: boolean
  isSigning: boolean
  signed: boolean
  info?: QuestInfoResponse
  onFetchInfo: typeof fetchQuestsInfoRequest
  onSign: (payload: string) => SignQuestsRequestAction
}

export type MapStateProps = Pick<
  Props,
  'wallet' | 'isConnected' | 'isConnecting' | 'signed' | 'isSigning' | 'info'
>
export type MapDispatchProps = Pick<Props, 'onFetchInfo' | 'onSign'>
