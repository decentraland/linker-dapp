import { AuthIdentity } from 'dcl-crypto'
import { loadingReducer, LoadingState } from 'decentraland-dapps/dist/modules/loading/reducer'

import {
  SignContentRequestAction,
  SignContentSuccessAction,
  SignContentFailureAction,
  SIGN_CONTENT_REQUEST,
  SIGN_CONTENT_SUCCESS,
  SIGN_CONTENT_FAILURE,
  CreateIdentityRequestAction,
  CreateIdentitySuccessAction,
  CreateIdentityFailureAction,
  CREATE_IDENTITY_REQUEST,
  CREATE_IDENTITY_SUCCESS,
  CREATE_IDENTITY_FAILURE
} from './actions'

export type SignatureState = {
  data: any
  identity: AuthIdentity | null
  loading: LoadingState
  error: string | null
}

const INITIAL_STATE: SignatureState = {
  data: '',
  loading: [],
  identity: null,
  error: null
}

export type SignatureReducerAction =
  | SignContentRequestAction
  | SignContentSuccessAction
  | SignContentFailureAction
  | CreateIdentityRequestAction
  | CreateIdentitySuccessAction
  | CreateIdentityFailureAction

export const signatureReducer = (state = INITIAL_STATE, action: SignatureReducerAction): SignatureState => {
  switch (action.type) {
    case SIGN_CONTENT_REQUEST:
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    case SIGN_CONTENT_SUCCESS:
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        data: action.payload.signature,
        error: null
      }
    case SIGN_CONTENT_FAILURE:
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: action.payload.error
      }
    case CREATE_IDENTITY_REQUEST:
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    case CREATE_IDENTITY_SUCCESS:
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        identity: action.payload.identity,
        error: null
      }
    case CREATE_IDENTITY_FAILURE:
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: action.payload.error
      }
    default: {
      return state
    }
  }
}
