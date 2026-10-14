import { AnyAction, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { RootState } from '../../types'
import { MapStateProps, MapDispatchProps } from './types'

import DeploySuccess from './DeploySuccess'
import {
  cancelDeployRequest,
  fetchCatalystRequest,
} from '../../modules/server/actions'
import {
  getCancelDeployError,
  getDeployState,
  getInfo,
  isCancellingDeploy,
} from '../../modules/server/selectors'

const mapState = (state: RootState): MapStateProps => {
  return {
    status: state.api.catalyst?.status,
    catalysts: state.api.catalyst?.catalysts || [],
    info: getInfo(state),
    deploySuccess: state.api.deploySuccess,
    apiError: state.api.error,
    deployState: getDeployState(state),
    isCancelling: isCancellingDeploy(state),
    cancelError: getCancelDeployError(state),
  }
}

const mapDispatch = (dispatch: Dispatch<AnyAction>): MapDispatchProps => {
  return {
    onFetchCatalyst: () => dispatch(fetchCatalystRequest()),
    onCancel: () => dispatch(cancelDeployRequest()),
  }
}

export default connect(mapState, mapDispatch)(DeploySuccess)
