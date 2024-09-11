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

import { createIdentityRequest } from '../../modules/signature/actions'
import { RootState } from '../../types'
import { MapStateProps, MapDispatchProps } from './types'

import IdentityPage from './IdentityPage'

const mapState = (state: RootState): MapStateProps => {
  return {
    wallet: getWallet(state),
    isConnected: isConnected(state),
    isConnecting: isConnecting(state),
    signed: !!getSignature(state),
    isSigning: isSigningTx(state),
  }
}

const mapDispatch = (dispatch: Dispatch<AnyAction>): MapDispatchProps => ({
  onConnectWallet: (providerType) =>
    dispatch(enableWalletRequest(providerType)),
  onRequestIdentity: () => dispatch(createIdentityRequest()),
})

export default connect(mapState, mapDispatch)(IdentityPage)
