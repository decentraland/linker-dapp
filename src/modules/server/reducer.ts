import {
  loadingReducer,
  LoadingState,
} from 'decentraland-dapps/dist/modules/loading/reducer'
import { Coords } from '../land/types'

import {
  FetchFilesRequestAction,
  FetchFilesSuccessAction,
  FetchFilesFailureAction,
  FETCH_FILES_REQUEST,
  FETCH_FILES_SUCCESS,
  FETCH_FILES_FAILURE,
  FETCH_INFO_REQUEST,
  FETCH_INFO_FAILURE,
  FETCH_INFO_SUCCESS,
  FetchInfoRequestAction,
  FetchInfoSuccessAction,
  FetchInfoFailureAction,
  FetchCatalystFailure,
  FetchCatalystRequest,
  FetchCatalystSuccess,
  FETCH_CATALYST_REQUEST,
  FETCH_CATALYST_SUCCESS,
  FETCH_CATALYST_FAILURE,
  DEPLOY_SUCCESS,
  DeploySuccessAction,
  UPDATE_DEPLOY_STATE,
  UpdateDeployStateAction,
  CANCEL_DEPLOY_REQUEST,
  CANCEL_DEPLOY_SUCCESS,
  CANCEL_DEPLOY_FAILURE,
  CancelDeployRequestAction,
  CancelDeploySuccessAction,
  CancelDeployFailureAction,
} from './actions'

import {
  StorageType,
  StorageAction,
  DeployState,
  isFinalDeployPhase,
} from './types'

export type Info = {
  rootCID: string
  debug: boolean
  estateRegistry?: string
  landRegistry?: string
  title?: string
  description?: string
  baseParcel: Coords
  parcels: Coords[]
  isPortableExperience: boolean
  isWorld: boolean
  skipValidations?: boolean
  // Storage fields
  storageType?: StorageType
  key?: string
  value?: string
  address?: string
  world?: string
  action?: StorageAction
  targetUrl?: string
  multiScene?: boolean
  deleteScenesFromWorldPayload?: string
}

export type FileSize = {
  name: string
  size: string
}

export type CatalystResponse = {
  catalysts: {
    url: string
    timestamp: number
    entityId: string
  }[]
  status: 'deploying' | 'success' | 'closed'
}

export type ApiState = {
  files: FileSize[]
  loading: LoadingState
  error: string | null
  catalyst: CatalystResponse | undefined
  info: Info | undefined
  deploySuccess: boolean
  // null when the CLI does not report the deployment state (older CLIs)
  deployState: DeployState | null
  cancelDeployError: string | null
}

export const INITIAL_STATE: ApiState = {
  info: undefined,
  files: [],
  loading: [],
  error: null,
  catalyst: undefined,
  deploySuccess: false,
  deployState: null,
  cancelDeployError: null,
}

export type ApiReducerAction =
  | FetchFilesRequestAction
  | FetchFilesSuccessAction
  | FetchFilesFailureAction
  | FetchInfoRequestAction
  | FetchInfoSuccessAction
  | FetchInfoFailureAction
  | FetchCatalystFailure
  | FetchCatalystRequest
  | FetchCatalystSuccess
  | DeploySuccessAction
  | UpdateDeployStateAction
  | CancelDeployRequestAction
  | CancelDeploySuccessAction
  | CancelDeployFailureAction

export const apiReducer = (
  state = INITIAL_STATE,
  action: ApiReducerAction,
): ApiState => {
  switch (action.type) {
    case DEPLOY_SUCCESS: {
      return {
        ...state,
        deploySuccess: true,
      }
    }
    case UPDATE_DEPLOY_STATE: {
      return {
        ...state,
        deployState: action.payload.state,
      }
    }
    case CANCEL_DEPLOY_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        cancelDeployError: null,
      }
    }
    case CANCEL_DEPLOY_SUCCESS: {
      // The outcome of a cancellation is reported by the deployment state
      // stream; only take the response when it is already final.
      const deployState = isFinalDeployPhase(action.payload.state.phase)
        ? action.payload.state
        : state.deployState
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        deployState,
      }
    }
    case CANCEL_DEPLOY_FAILURE: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        cancelDeployError: action.payload.error,
      }
    }
    case FETCH_FILES_REQUEST:
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
      }
    case FETCH_FILES_SUCCESS:
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        files: action.payload.files,
        error: null,
      }
    case FETCH_FILES_FAILURE:
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: action.payload.error,
        files: [],
      }
    case FETCH_CATALYST_REQUEST:
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
      }
    case FETCH_CATALYST_SUCCESS:
      if (!action.payload.catalysts.length) {
        return state
      }
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        catalyst: action.payload,
        error: null,
      }
    case FETCH_CATALYST_FAILURE:
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: action.payload.error,
      }
    case FETCH_INFO_REQUEST:
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
      }
    case FETCH_INFO_SUCCESS:
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        info: {
          ...action.payload.info,
          baseParcel: parseCoords(action.payload.info.baseParcel)[0],
          parcels: parseCoords(action.payload.info.parcels),
          rootCID:
            action.payload.info.rootCID ||
            'QmPjpPyibbryTCi75zzcdeuPUBcujtEqj43shwKBAdMojy',
        },
        error: null,
      }
    case FETCH_INFO_FAILURE:
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: action.payload.error,
        info: undefined,
      }
    default: {
      return state
    }
  }
}

function parseCoords(query: string | string[] | null): Coords[] {
  if (!query) return [{ x: 0, y: 0 }]
  const coords = typeof query === 'string' ? [query] : query
  return coords.map((c) => {
    const [x, y] = c.split(',')
    return { x: parseInt(x, 10), y: parseInt(y, 10) }
  })
}
