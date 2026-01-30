import { AnyAction, Dispatch } from 'redux'
import { connect } from 'react-redux'
import {
  getData as getWallet,
  isConnected,
  isConnecting,
} from 'decentraland-dapps/dist/modules/wallet/selectors'
import {
  getData as getSignature,
  isLoading as isSigningTx,
} from '../../modules/signature/selectors'
import { signLogsRequest } from '../../modules/signature/actions'
import { RootState } from '../../types'
import { MapStateProps, MapDispatchProps } from './types'

import ServerLogsPage from './ServerLogsPage'
import { fetchInfoRequest } from '../../modules/server/actions'
import { getInfo } from '../../modules/server/selectors'

const mapState = (state: RootState): MapStateProps => {
  return {
    wallet: getWallet(state),
    isConnected: isConnected(state),
    isConnecting: isConnecting(state),
    signed: !!getSignature(state),
    isSigning: isSigningTx(state),
    info: getInfo(state),
    error: state.signature.error,
  }
}

const mapDispatch = (dispatch: Dispatch<AnyAction>): MapDispatchProps => ({
  onSignContent: (cid: string) => dispatch(signLogsRequest(cid)),
  onFetchInfo: () => dispatch(fetchInfoRequest()),
})

export default connect(mapState, mapDispatch)(ServerLogsPage)
