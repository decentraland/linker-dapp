import { fetchWorldACLRequest } from '../../../modules/acl/actions'
import { InfoResponse } from '../../../modules/acl/types'

export enum ACLStatus {
  UPDATING = 'updating',
  UPDATED = 'updated',
}

export type Props = {
  aclStatus: ACLStatus
  info: InfoResponse
  onFetchWorldACL: typeof fetchWorldACLRequest
}

export type MapStateProps = Pick<Props, 'aclStatus'>
export type MapDispatchProps = Pick<Props, 'onFetchWorldACL'>

export type OwnProps = Pick<Props, 'info'>
