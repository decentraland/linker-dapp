import { AuthIdentity } from 'dcl-crypto'
import { action } from 'typesafe-actions'

export const SIGN_CONTENT_REQUEST = '[Request] Sign Content'
export const SIGN_CONTENT_SUCCESS = '[Success] Sign Content'
export const SIGN_CONTENT_FAILURE = '[Failure] Sign Content'

export const signContentRequest = (cid: string) => action(SIGN_CONTENT_REQUEST, cid)
export const signContentSuccess = (signature: string) => action(SIGN_CONTENT_SUCCESS, { signature })
export const signContentFailure = (error: string) => action(SIGN_CONTENT_FAILURE, { error })

export type SignContentRequestAction = ReturnType<typeof signContentRequest>
export type SignContentSuccessAction = ReturnType<typeof signContentSuccess>
export type SignContentFailureAction = ReturnType<typeof signContentFailure>

export const CREATE_IDENTITY_REQUEST = '[Request] Create Identity'
export const CREATE_IDENTITY_SUCCESS = '[Success] Create Identity'
export const CREATE_IDENTITY_FAILURE = '[Failure] Create Identity'

export const createIdentityRequest = () => action(CREATE_IDENTITY_REQUEST, {})
export const createIdentitySuccess = (identity: AuthIdentity) => action(CREATE_IDENTITY_SUCCESS, { identity })
export const createIdentityFailure = (error: string) => action(CREATE_IDENTITY_FAILURE, { error })

export type CreateIdentityRequestAction = ReturnType<typeof createIdentityRequest>
export type CreateIdentitySuccessAction = ReturnType<typeof createIdentitySuccess>
export type CreateIdentityFailureAction = ReturnType<typeof createIdentityFailure>
