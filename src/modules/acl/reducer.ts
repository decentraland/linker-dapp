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
  DELETE_WORLD_ACL_REQUEST,
  PUT_WORLD_ACL_REQUEST,
  DeleteWorldACLFailureAction,
  DeleteWorldACLRequestAction,
  DeleteWorldACLSuccessAction,
  PutWorldACLFailureAction,
  PutWorldACLRequestAction,
  PutWorldACLSuccessAction,
  DELETE_WORLD_ACL_FAILURE,
  DELETE_WORLD_ACL_SUCCESS,
  PUT_WORLD_ACL_FAILURE,
  PUT_WORLD_ACL_SUCCESS,
} from './actions'
import { InfoResponse } from './types'

/** @deprecated */
export type ACLResponse = {
  resource: string
  allowed: string[]
}

export enum WorldPermissionType {
  Unrestricted = 'unrestricted',
  AllowList = 'allow-list'
}

export type AllowListPermissionSetting = {
  type: WorldPermissionType.AllowList
  wallets: string[]
}

export type WorldPermissions = {
  deployment: AllowListPermissionSetting
}

export type WorldPermissionsResponse = {
  permissions: WorldPermissions
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
  | PutWorldACLFailureAction
  | PutWorldACLRequestAction
  | PutWorldACLSuccessAction
  | DeleteWorldACLFailureAction
  | DeleteWorldACLRequestAction
  | DeleteWorldACLSuccessAction

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
        acl: {resource: action.payload.worldName, allowed: action.payload.acl.permissions.deployment.wallets},
        error: null,
      }
    case FETCH_WORLD_ACL_FAILURE:
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: action.payload.error,
        acl: undefined,
      }
    case PUT_WORLD_ACL_REQUEST:
    case DELETE_WORLD_ACL_REQUEST:
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
      }
    case PUT_WORLD_ACL_SUCCESS:
    case DELETE_WORLD_ACL_SUCCESS:
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: null,
      }
    case PUT_WORLD_ACL_FAILURE:
    case DELETE_WORLD_ACL_FAILURE:
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
