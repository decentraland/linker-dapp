import {
  loadingReducer,
  LoadingState,
} from 'decentraland-dapps/dist/modules/loading/reducer'
import {
  FETCH_INFO_REQUEST,
  FETCH_INFO_FAILURE,
  FETCH_INFO_SUCCESS,
  FetchInfoRequestAction,
  FetchInfoSuccessAction,
  FetchInfoFailureAction,
  FetchWorldACLFailureAction,
  FetchWorldACLRequestAction,
  FetchWorldACLSuccessAction,
  FETCH_WORLD_ACL_REQUEST,
  FETCH_WORLD_ACL_SUCCESS,
  FETCH_WORLD_ACL_FAILURE,
  UpdateWorldACLFailureAction,
  UpdateWorldACLRequestAction,
  UpdateWorldACLSuccessAction,
  UPDATE_WORLD_ACL_FAILURE,
  UPDATE_WORLD_ACL_REQUEST,
  UPDATE_WORLD_ACL_SUCCESS,
} from './actions'
import { InfoResponse } from './types'

export type ACLResponse = {
  resource: string
  allowed: string[]
}

export type ACLState = {
  loading: LoadingState
  error: string | null
  info: InfoResponse | undefined
  acl: ACLResponse | undefined
}

export const INITIAL_STATE: ACLState = {
  info: undefined,
  acl: undefined,
  loading: [],
  error: null,
}

export type ApiReducerAction =
  | FetchInfoRequestAction
  | FetchInfoSuccessAction
  | FetchInfoFailureAction
  | FetchWorldACLFailureAction
  | FetchWorldACLRequestAction
  | FetchWorldACLSuccessAction
  | UpdateWorldACLFailureAction
  | UpdateWorldACLRequestAction
  | UpdateWorldACLSuccessAction

export const aclReducer = (
  state = INITIAL_STATE,
  action: ApiReducerAction
): ACLState => {
  switch (action.type) {
    case FETCH_INFO_REQUEST:
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
      }
    case FETCH_INFO_SUCCESS:
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        info: action.payload.info,
        error: null,
      }
    case FETCH_INFO_FAILURE:
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: action.payload.error,
        info: undefined,
      }
    case FETCH_WORLD_ACL_REQUEST:
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
      }
    case FETCH_WORLD_ACL_SUCCESS:
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        acl: action.payload.acl,
        error: null,
      }
    case FETCH_WORLD_ACL_FAILURE:
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: action.payload.error,
        acl: undefined,
      }
    case UPDATE_WORLD_ACL_REQUEST:
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
      }
    case UPDATE_WORLD_ACL_SUCCESS:
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: null,
      }
    case UPDATE_WORLD_ACL_FAILURE:
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: action.payload.error,
      }
    default: {
      return state
    }
  }
}
