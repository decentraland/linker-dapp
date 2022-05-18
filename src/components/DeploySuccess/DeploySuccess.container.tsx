import { AnyAction, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { RootState } from '../../types'
import { MapStateProps, MapDispatchProps } from './types'

import DeploySuccess from './DeploySuccess'

const mapState = (_state: RootState): MapStateProps => {
  return {}
}

const mapDispatch = (_dispatch: Dispatch<AnyAction>): MapDispatchProps => {
  return {}
}

export default connect(mapState, mapDispatch)(DeploySuccess)
