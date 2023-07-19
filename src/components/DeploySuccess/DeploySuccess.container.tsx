import { AnyAction, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { RootState } from '../../types'
import { MapStateProps, MapDispatchProps } from './types'

import DeploySuccess from './DeploySuccess'
import { fetchCatalystRequest } from '../../modules/server/actions'
import { getInfo } from '../../modules/server/selectors'

const mapState = (state: RootState): MapStateProps => {
  return {
    status: state.api.catalyst?.status,
    catalysts: state.api.catalyst?.catalysts || [],
    info: getInfo(state),
    deploySuccess: state.api.deploySuccess,
    apiError: state.api.error
  }
}

const mapDispatch = (dispatch: Dispatch<AnyAction>): MapDispatchProps => {
  return {
    onFetchCatalyst: () => dispatch(fetchCatalystRequest())
  }
}

export default connect(mapState, mapDispatch)(DeploySuccess)
