import { Wallet } from "decentraland-dapps/dist/modules/wallet/types"
import { QuestInfoResponse } from "../../modules/quests/types"
import { enableWalletRequest } from "decentraland-dapps/dist/modules/wallet/actions"
import { fetchQuestsInfoRequest } from "../../modules/quests/action"
import { SignQuestsRequestAction } from "../../modules/signature/actions"

export type Props = {
  wallet: Partial<Wallet>
  isConnected: boolean
  isConnecting: boolean
  isSigning: boolean
  signed: boolean
  info?: QuestInfoResponse
  onConnectWallet: typeof enableWalletRequest
  onFetchInfo: typeof fetchQuestsInfoRequest
  onSign: (payload: string) => SignQuestsRequestAction
}

export type MapStateProps = Pick<
  Props,
  'wallet' | 'isConnected' | 'isConnecting' | 'signed' | 'isSigning' | 'info'
>
export type MapDispatchProps = Pick<Props, 'onConnectWallet' | 'onFetchInfo' | 'onSign'>