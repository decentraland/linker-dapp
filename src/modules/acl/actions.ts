import { action } from 'typesafe-actions'
import { WorldPermissionsResponse } from './reducer'
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

export const PUT_WORLD_ACL_REQUEST = '[Request] Put World ACL'
export const PUT_WORLD_ACL_SUCCESS = '[Success] Put World ACL'
export const PUT_WORLD_ACL_FAILURE = '[Failure] Put World ACL'

export const DELETE_WORLD_ACL_REQUEST = '[Request] Delete World ACL'
export const DELETE_WORLD_ACL_SUCCESS = '[Success] Delete World ACL'
export const DELETE_WORLD_ACL_FAILURE = '[Failure] Delete World ACL'

export const fetchInfoRequest = () => action(FETCH_INFO_REQUEST)
export const fetchInfoSuccess = (info: InfoResponse) =>
  action(FETCH_INFO_SUCCESS, { info })
export const fetchInfoFailure = (error: string) =>
  action(FETCH_INFO_FAILURE, { error })

export const fetchWorldACLRequest = (targetContent: string, worldName: string) =>
  action(FETCH_WORLD_ACL_REQUEST, { targetContent, worldName })
export const fetchWorldACLSuccess = (acl: WorldPermissionsResponse, worldName: string) =>
  action(FETCH_WORLD_ACL_SUCCESS, { acl, worldName })
export const fetchWorldACLFailure = (error: string) =>
  action(FETCH_WORLD_ACL_FAILURE, { error })

export type FetchInfoRequestAction = ReturnType<typeof fetchInfoRequest>
export type FetchInfoSuccessAction = ReturnType<typeof fetchInfoSuccess>
export type FetchInfoFailureAction = ReturnType<typeof fetchInfoFailure>

export type FetchWorldACLRequestAction = ReturnType<typeof fetchWorldACLRequest>
export type FetchWorldACLSuccessAction = ReturnType<typeof fetchWorldACLSuccess>
export type FetchWorldACLFailureAction = ReturnType<typeof fetchWorldACLFailure>

export const putWorldACLRequest = (signature: string ) =>
  action(PUT_WORLD_ACL_REQUEST, { signature })
export const putWorldACLSuccess = () => action(PUT_WORLD_ACL_SUCCESS)
export const putWorldACLFailure = (error: string) =>
  action(PUT_WORLD_ACL_FAILURE, { error })

export type PutWorldACLRequestAction = ReturnType<
  typeof putWorldACLRequest
>
export type PutWorldACLSuccessAction = ReturnType<
  typeof putWorldACLSuccess
>
export type PutWorldACLFailureAction = ReturnType<
  typeof putWorldACLFailure
>

export const deleteWorldACLRequest = (signature: string ) =>
  action(DELETE_WORLD_ACL_REQUEST, { signature })
export const deleteWorldACLSuccess = () => action(DELETE_WORLD_ACL_SUCCESS)
export const deleteWorldACLFailure = (error: string) =>
  action(DELETE_WORLD_ACL_FAILURE, { error })

export type DeleteWorldACLRequestAction = ReturnType<
  typeof deleteWorldACLRequest
>
export type DeleteWorldACLSuccessAction = ReturnType<
  typeof deleteWorldACLSuccess
>
export type DeleteWorldACLFailureAction = ReturnType<
  typeof deleteWorldACLFailure
>
