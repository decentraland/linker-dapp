import { AnyAction, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { RootState } from '../../../types'
import { fetchWorldACLRequest } from '../../../modules/acl/actions'
import { getACLStatus } from '../../../modules/acl/selectors'
import { MapStateProps, MapDispatchProps } from './types'
import ACLStatus from './ACLStatus'

const mapState = (state: RootState): MapStateProps => ({
  aclStatus: getACLStatus(state),
})

const mapDispatch = (dispatch: Dispatch<AnyAction>): MapDispatchProps => {
  return {
    onFetchWorldACL: (targetContent: string, worldName: string) =>
      dispatch(fetchWorldACLRequest(targetContent, worldName)),
  }
}

export default connect(mapState, mapDispatch)(ACLStatus)
