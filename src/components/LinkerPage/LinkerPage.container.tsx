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
import {
  getData as getAuthorizations,
  isUpdateAuthorized,
  isLoading as isAuthorizationLoading,
} from '../../modules/authorization/selectors'
import { signContentRequest } from '../../modules/signature/actions'
import { RootState } from '../../types'
import { MapStateProps, MapDispatchProps } from './types'

import LinkerPage from './LinkerPage'
import {
  fetchFilesRequest,
  fetchInfoRequest,
} from '../../modules/server/actions'
import { getInfo } from '../../modules/server/selectors'

const mapState = (state: RootState): MapStateProps => {
  return {
    wallet: getWallet(state)!,
    isConnected: isConnected(state),
    isConnecting: isConnecting(state),
    signed: !!getSignature(state),
    isUpdateAuthorized: isUpdateAuthorized(state),
    authorizations: getAuthorizations(state),
    isAuthorizationLoading: isAuthorizationLoading(state),
    isSigning: isSigningTx(state),
    info: getInfo(state),
    deployError: state.signature.error
  }
}

const mapDispatch = (dispatch: Dispatch<AnyAction>): MapDispatchProps => ({
  onConnectWallet: (providerType) =>
    dispatch(enableWalletRequest(providerType)),
  onSignContent: (cid: string) => dispatch(signContentRequest(cid)),
  onFetchFiles: () => dispatch(fetchFilesRequest()),
  onFetchInfo: () => dispatch(fetchInfoRequest()),
})

export default connect(mapState, mapDispatch)(LinkerPage)
