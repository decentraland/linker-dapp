import { AnyAction, Dispatch } from "redux";
import { enableWalletRequest } from "decentraland-dapps/dist/modules/wallet/actions";
import {
  getData as getWallet,
  isConnected,
  isConnecting,
} from 'decentraland-dapps/dist/modules/wallet/selectors'
import { RootState } from "../../types";
import { MapDispatchProps, MapStateProps } from "./types";
import {
  getData as getSignature,
  isLoading as isSigningTx,
} from '../../modules/signature/selectors'
import { connect } from "react-redux";
import QuestsPage from "./QuestsPage";
import { changeQuestActionType, fetchQuestsInfoRequest } from "../../modules/quests/action";
import { getQuestsInfo } from "../../modules/quests/selector";
import { signQuestsRequest } from "../../modules/signature/actions";


const mapState = (state: RootState): MapStateProps => {
	return {
		wallet: getWallet(state)!,			
		isConnected: isConnected(state),
		isConnecting: isConnecting(state),
		signed: !!getSignature(state),
		isSigning: isSigningTx(state),
		info: getQuestsInfo(state),
		actionType: state.quests.actionType
	}
}

const mapDispatch = (dispatch: Dispatch<AnyAction>): MapDispatchProps => ({
	onConnectWallet: (providerType) => dispatch(enableWalletRequest(providerType)),
	onSign: (payload) => dispatch(signQuestsRequest(payload)),
	onFetchInfo: () => dispatch(fetchQuestsInfoRequest()),
	onChangeType: (type) => dispatch(changeQuestActionType(type))
})

export default connect(mapState, mapDispatch)(QuestsPage)