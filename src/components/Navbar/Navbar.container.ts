import { connect } from 'react-redux'
import { AnyAction, Dispatch } from 'redux'
import {
  disconnectWalletRequest,
  getAddress,
  isConnecting,
} from 'decentraland-dapps/dist/modules/wallet'
import { isLoggedIn } from '../../modules/wallet/selectors'
import { RootState } from '../../types'
import { MapStateProps, MapDispatchProps } from './Navbar.types'
import { Navbar } from './Navbar'

const mapState = (state: RootState): MapStateProps => ({
  address: getAddress(state),
  isSignedIn: isLoggedIn(state),
  isSigningIn: isConnecting(state),
})

const mapDispatch = (dispatch: Dispatch<AnyAction>): MapDispatchProps => ({
  onSignOut: () => dispatch(disconnectWalletRequest()),
})

export default connect(mapState, mapDispatch)(Navbar)
