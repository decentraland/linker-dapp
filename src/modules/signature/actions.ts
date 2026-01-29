import { AuthChain, AuthIdentity } from '@dcl/crypto'
import { action } from 'typesafe-actions'

export const SIGN_CONTENT_REQUEST = '[Request] Sign Content'
export const SIGN_CONTENT_SUCCESS = '[Success] Sign Content'
export const SIGN_CONTENT_FAILURE = '[Failure] Sign Content'

export const signContentRequest = (cid: string) =>
  action(SIGN_CONTENT_REQUEST, cid)
export const signContentSuccess = (authChain: AuthChain) =>
  action(SIGN_CONTENT_SUCCESS, { authChain })
export const signContentFailure = (error: string) =>
  action(SIGN_CONTENT_FAILURE, { error })

export type SignContentRequestAction = ReturnType<typeof signContentRequest>
export type SignContentSuccessAction = ReturnType<typeof signContentSuccess>
export type SignContentFailureAction = ReturnType<typeof signContentFailure>

export const CREATE_IDENTITY_REQUEST = '[Request] Create Identity'
export const CREATE_IDENTITY_SUCCESS = '[Success] Create Identity'
export const CREATE_IDENTITY_FAILURE = '[Failure] Create Identity'

export const createIdentityRequest = () => action(CREATE_IDENTITY_REQUEST, {})
export const createIdentitySuccess = (identity: AuthIdentity) =>
  action(CREATE_IDENTITY_SUCCESS, { identity })
export const createIdentityFailure = (error: string) =>
  action(CREATE_IDENTITY_FAILURE, { error })

export type CreateIdentityRequestAction = ReturnType<
  typeof createIdentityRequest
>
export type CreateIdentitySuccessAction = ReturnType<
  typeof createIdentitySuccess
>
export type CreateIdentityFailureAction = ReturnType<
  typeof createIdentityFailure
>

export const SIGN_PUT_WORLD_ACL_REQUEST = '[Request] Sign Put World ACL'
export const SIGN_PUT_WORLD_ACL_SUCCESS = '[Success] Sign Put World ACL'
export const SIGN_PUT_WORLD_ACL_FAILURE = '[Failure] Sign Put World ACL'

export const signPutWorldACLRequest = (payload: string) =>
  action(SIGN_PUT_WORLD_ACL_REQUEST, payload)
export const signPutWorldACLSuccess = (authChain: AuthChain) =>
  action(SIGN_PUT_WORLD_ACL_SUCCESS, { authChain })
export const signPutWorldACLFailure = (error: string) =>
  action(SIGN_PUT_WORLD_ACL_FAILURE, { error })

export type SignPutWorldACLRequestAction = ReturnType<
  typeof signPutWorldACLRequest
>
export type SignPutWorldACLSuccessAction = ReturnType<
  typeof signPutWorldACLSuccess
>
export type SignPutWorldACLFailureAction = ReturnType<
  typeof signPutWorldACLFailure
>

export const SIGN_DELETE_WORLD_ACL_REQUEST = '[Request] Sign Delete World ACL'
export const SIGN_DELETE_WORLD_ACL_SUCCESS = '[Success] Sign Delete World ACL'
export const SIGN_DELETE_WORLD_ACL_FAILURE = '[Failure] Sign Delete World ACL'

export const signDeleteWorldACLRequest = (payload: string) =>
  action(SIGN_DELETE_WORLD_ACL_REQUEST, payload)
export const signDeleteWorldACLSuccess = (authChain: AuthChain) =>
  action(SIGN_DELETE_WORLD_ACL_SUCCESS, { authChain })
export const signDeleteWorldACLFailure = (error: string) =>
  action(SIGN_DELETE_WORLD_ACL_FAILURE, { error })

export type SignDeleteWorldACLRequestAction = ReturnType<
  typeof signDeleteWorldACLRequest
>
export type SignDeleteWorldACLSuccessAction = ReturnType<
  typeof signDeleteWorldACLSuccess
>
export type SignDeleteWorldACLFailureAction = ReturnType<
  typeof signDeleteWorldACLFailure
>

export const SIGN_QUESTS_REQUEST = '[Request] Sign Quests'
export const SIGN_QUESTS_SUCCESS = '[Success] Sign Quests'
export const SIGN_QUESTS_FAILURE = '[Failure] Sign Quests'

export const signQuestsRequest = (payload: string) =>
  action(SIGN_QUESTS_REQUEST, payload)
export const signQuestsSuccess = (authChain: AuthChain) =>
  action(SIGN_QUESTS_SUCCESS, { authChain })
export const signQuestsFailure = (error: string) =>
  action(SIGN_QUESTS_FAILURE, { error })

export type SignQuestsRequestAction = ReturnType<typeof signQuestsRequest>
export type SignQuestsSuccessAction = ReturnType<typeof signQuestsSuccess>
export type SignQuestsFailureAction = ReturnType<typeof signQuestsFailure>

// Storage signing actions
export const SIGN_STORAGE_REQUEST = '[Request] Sign Storage'
export const SIGN_STORAGE_SUCCESS = '[Success] Sign Storage'
export const SIGN_STORAGE_FAILURE = '[Failure] Sign Storage'

export const signStorageRequest = (payload: string) =>
  action(SIGN_STORAGE_REQUEST, payload)
export const signStorageSuccess = (authChain: AuthChain) =>
  action(SIGN_STORAGE_SUCCESS, { authChain })
export const signStorageFailure = (error: string) =>
  action(SIGN_STORAGE_FAILURE, { error })

export type SignStorageRequestAction = ReturnType<typeof signStorageRequest>
export type SignStorageSuccessAction = ReturnType<typeof signStorageSuccess>
export type SignStorageFailureAction = ReturnType<typeof signStorageFailure>
