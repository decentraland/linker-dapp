import { Wallet } from "decentraland-dapps/dist/modules/wallet/types"
import { QuestInfoResponse } from "../../modules/quests/types"
import { enableWalletRequest } from "decentraland-dapps/dist/modules/wallet/actions"
import { ChangeQuestActionTypeAction, fetchQuestsInfoRequest } from "../../modules/quests/action"
import { SignQuestsRequestAction } from "../../modules/signature/actions"

export type Props = {
  wallet: Partial<Wallet>
  isConnected: boolean
  isConnecting: boolean
  isSigning: boolean
  signed: boolean
  info?: QuestInfoResponse
  actionType?:  "create" | "list" | "activate" | "deactivate"
  onConnectWallet: typeof enableWalletRequest
  onFetchInfo: typeof fetchQuestsInfoRequest
  onSign: (payload: string) => SignQuestsRequestAction
  onChangeType: (newAction: "create" | "list" | "activate" | "deactivate") => ChangeQuestActionTypeAction
}

export type MapStateProps = Pick<
  Props,
  'wallet' | 'isConnected' | 'isConnecting' | 'signed' | 'isSigning' | 'info' | 'actionType'
>
export type MapDispatchProps = Pick<Props, 'onConnectWallet' | 'onFetchInfo' | 'onSign' | 'onChangeType'>