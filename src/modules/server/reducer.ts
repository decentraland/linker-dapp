import {
  loadingReducer,
  LoadingState
} from 'decentraland-dapps/dist/modules/loading/reducer'

import {
  FetchFilesRequestAction,
  FetchFilesSuccessAction,
  FetchFilesFailureAction,
  FETCH_FILES_REQUEST,
  FETCH_FILES_SUCCESS,
  FETCH_FILES_FAILURE
} from './actions'

export type FileSize = {
  name: string
  size: string
}

export type ApiState = {
  files: FileSize[]
  loading: LoadingState
  error: string | null
}

const INITIAL_STATE: ApiState = {
  files: [],
  loading: [],
  error: null
}

export type ApiReducerAction =
  | FetchFilesRequestAction
  | FetchFilesSuccessAction
  | FetchFilesFailureAction

export const apiReducer = (
  state = INITIAL_STATE,
  action: ApiReducerAction
): ApiState => {
  switch (action.type) {
    case FETCH_FILES_REQUEST:
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    case FETCH_FILES_SUCCESS:
      return {
        loading: loadingReducer(state.loading, action),
        files: action.payload.files,
        error: null
      }
    case FETCH_FILES_FAILURE:
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: action.payload.error,
        files: []
      }
    default: {
      return state
    }
  }
}
