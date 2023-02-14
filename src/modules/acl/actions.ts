import { action } from 'typesafe-actions'
import { ACLResponse } from './reducer'
import { InfoResponse } from './types'

export const FETCH_INFO_REQUEST = '[Request] Fetch World ACL info'
export const FETCH_INFO_SUCCESS = '[Success] Fetch World ACL info'
export const FETCH_INFO_FAILURE = '[Failure] Fetch World ACL info'

export const FETCH_WORLD_ACL_REQUEST = '[Request] Fetch World ACL'
export const FETCH_WORLD_ACL_SUCCESS = '[Success] Fetch World ACL'
export const FETCH_WORLD_ACL_FAILURE = '[Failure] Fetch World ACL'

export const UPDATE_WORLD_ACL_REQUEST = '[Request] Update World ACL'
export const UPDATE_WORLD_ACL_SUCCESS = '[Success] Update World ACL'
export const UPDATE_WORLD_ACL_FAILURE = '[Failure] Update World ACL'

export const fetchInfoRequest = () => action(FETCH_INFO_REQUEST)
export const fetchInfoSuccess = (info: InfoResponse) =>
  action(FETCH_INFO_SUCCESS, { info })
export const fetchInfoFailure = (error: string) =>
  action(FETCH_INFO_FAILURE, { error })

export const fetchWorldACLRequest = (targetContent: string, worldName: string) =>
  action(FETCH_WORLD_ACL_REQUEST, { targetContent, worldName })
export const fetchWorldACLSuccess = (acl: ACLResponse) =>
  action(FETCH_WORLD_ACL_SUCCESS, { acl })
export const fetchWorldACLFailure = (error: string) =>
  action(FETCH_WORLD_ACL_FAILURE, { error })

export const updateWorldACLRequest = (signature: string) =>
  action(UPDATE_WORLD_ACL_REQUEST, { signature })
export const updateWorldACLSuccess = () => action(UPDATE_WORLD_ACL_SUCCESS)
export const updateWorldACLFailure = (error: string) =>
  action(UPDATE_WORLD_ACL_FAILURE, { error })

export type FetchInfoRequestAction = ReturnType<typeof fetchInfoRequest>
export type FetchInfoSuccessAction = ReturnType<typeof fetchInfoSuccess>
export type FetchInfoFailureAction = ReturnType<typeof fetchInfoFailure>

export type FetchWorldACLRequestAction = ReturnType<typeof fetchWorldACLRequest>
export type FetchWorldACLSuccessAction = ReturnType<typeof fetchWorldACLSuccess>
export type FetchWorldACLFailureAction = ReturnType<typeof fetchWorldACLFailure>

export type UpdateWorldACLRequestAction = ReturnType<
  typeof updateWorldACLRequest
>
export type UpdateWorldACLSuccessAction = ReturnType<
  typeof updateWorldACLSuccess
>
export type UpdateWorldACLFailureAction = ReturnType<
  typeof updateWorldACLFailure
>
