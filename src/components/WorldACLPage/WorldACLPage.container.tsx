import { AnyAction, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { enableWalletRequest } from 'decentraland-dapps/dist/modules/wallet/actions'
import {
  getData as getWallet,
  isConnected,
  isConnecting,
} from 'decentraland-dapps/dist/modules/wallet/selectors'
import {
  getData as getSignature,
  isLoading as isSigningTx,
} from '../../modules/signature/selectors'
import { signWorldACLRequest } from '../../modules/signature/actions'
import { RootState } from '../../types'
import { fetchInfoRequest } from '../../modules/acl/actions'
import { getInfo } from '../../modules/acl/selectors'
import WorldACLPage from './WorldACLPage'
import { MapStateProps, MapDispatchProps } from './types'

const mapState = (state: RootState): MapStateProps => {
  return {
    wallet: getWallet(state)!,
    isConnected: isConnected(state),
    isConnecting: isConnecting(state),
    signed: !!getSignature(state),
    isSigning: isSigningTx(state),
    info: getInfo(state),
  }
}

const mapDispatch = (dispatch: Dispatch<AnyAction>): MapDispatchProps => ({
  onConnectWallet: (providerType) =>
    dispatch(enableWalletRequest(providerType)),
  onSignContent: (payload: string) => dispatch(signWorldACLRequest(payload)),
  onFetchInfo: () => dispatch(fetchInfoRequest()),
})

export default connect(mapState, mapDispatch)(WorldACLPage)
