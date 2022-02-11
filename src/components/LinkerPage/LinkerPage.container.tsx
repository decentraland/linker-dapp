import { AnyAction, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { ProviderType } from 'decentraland-connect'
import { enableWalletRequest } from 'decentraland-dapps/dist/modules/wallet/actions'
import {
  getData as getWallet,
  isConnected,
  isConnecting
} from 'decentraland-dapps/dist/modules/wallet/selectors'

import {
  isLoading as isLandLoading,
  getData as getLand,
  getError as getLandError
} from '../../modules/land/selectors'
import {
  getData as getSignature,
  isLoading as isSigningTx
} from '../../modules/signature/selectors'
import {
  getData as getAuthorizations,
  isUpdateAuthorized,
  isLoading as isAuthorizationLoading
} from '../../modules/authorization/selectors'
import { signContentRequest } from '../../modules/signature/actions'
import { RootState } from '../../types'
import { MapStateProps, MapDispatchProps } from './types'

import LinkerPage from './LinkerPage'

const mapState = (state: RootState): MapStateProps => {
  return {
    base: getLand(state),
    wallet: getWallet(state)!,
    isLandLoading: isLandLoading(state),
    isConnected: isConnected(state),
    isConnecting: isConnecting(state),
    error: getLandError(state)!,
    signed: !!getSignature(state),
    isUpdateAuthorized: isUpdateAuthorized(state),
    authorizations: getAuthorizations(state),
    isAuthorizationLoading: isAuthorizationLoading(state),
    isSigning: isSigningTx(state)
  }
}

const mapDispatch = (dispatch: Dispatch<AnyAction>): MapDispatchProps => ({
  onConnectWallet: () => dispatch(enableWalletRequest(ProviderType.INJECTED)),
  onSignContent: (cid: string) => dispatch(signContentRequest(cid))
})

export default connect(mapState, mapDispatch)(LinkerPage)
