import { loadingReducer } from 'decentraland-dapps/dist/modules/loading/reducer'
import {
  FETCH_FILES_SUCCESS,
  FETCH_INFO_SUCCESS,
  FETCH_CATALYST_SUCCESS,
  fetchFilesRequest,
  fetchCatalystRequest,
  fetchInfoRequest,
  fetchCatalystFailure,
  fetchFilesFailure,
  fetchFilesSuccess,
  fetchInfoFailure,
  fetchCatalystSuccess,
  fetchInfoSuccess,
  UPDATE_DEPLOY_STATE,
  CANCEL_DEPLOY_REQUEST,
  CANCEL_DEPLOY_SUCCESS,
  CANCEL_DEPLOY_FAILURE,
  updateDeployState,
  cancelDeployRequest,
  cancelDeploySuccess,
  cancelDeployFailure,
} from './actions'
import {
  INITIAL_STATE,
  apiReducer,
  CatalystResponse,
  FileSize,
  ApiState,
} from './reducer'
import { DeployState, InfoResponse } from './types'

const error = 'error'

const requestActions = [
  fetchFilesRequest(),
  fetchCatalystRequest(),
  fetchInfoRequest(),
]

const failureActions = [
  { request: fetchFilesRequest(), failure: fetchFilesFailure(error) },
  { request: fetchCatalystRequest(), failure: fetchCatalystFailure(error) },
  { request: fetchInfoRequest(), failure: fetchInfoFailure(error) },
]

describe('server reducer', () => {
  requestActions.forEach((action) => {
    describe(`when reducing the "${action.type}" action`, () => {
      it('should return a state with the loading set', () => {
        const initialState = {
          ...INITIAL_STATE,
          loading: [],
        }

        expect(apiReducer(initialState, action)).toEqual({
          ...INITIAL_STATE,
          loading: loadingReducer(initialState.loading, action),
        })
      })
    })
  })

  failureActions.forEach((action) => {
    describe(`when reducing the "${action.failure.type}" action`, () => {
      it('should return a state with the error set and the loading state cleared', () => {
        const initialState = {
          ...INITIAL_STATE,
          error: null,
          loading: loadingReducer([], action.request),
        }

        expect(apiReducer(initialState, action.failure)).toEqual({
          ...INITIAL_STATE,
          error,
          loading: [],
        })
      })
    })
  })

  describe(`when reducing the ${FETCH_FILES_SUCCESS} action`, () => {
    const initialState = {
      ...INITIAL_STATE,
      loading: loadingReducer([], fetchFilesRequest()),
    }

    const files: FileSize[] = []

    it('should add the files to the store', () => {
      expect(apiReducer(initialState, fetchFilesSuccess(files))).toEqual({
        ...INITIAL_STATE,
        loading: [],
        files,
      })
    })
  })

  describe(`when reducing the ${FETCH_CATALYST_SUCCESS} action`, () => {
    const initialState = {
      ...INITIAL_STATE,
      loading: loadingReducer([], fetchCatalystRequest()),
    }

    describe(`when there are no catalysts`, () => {
      const catalyst: CatalystResponse = {
        catalysts: [],
        status: 'deploying',
      }

      it('should not change the store', () => {
        expect(
          apiReducer(initialState, fetchCatalystSuccess(catalyst))
        ).toEqual(initialState)
      })
    })

    describe(`when there are catalysts`, () => {
      const catalyst: CatalystResponse = {
        catalysts: [
          { url: 'catalyst.url', timestamp: 12345678, entityId: 'entityId' },
        ],
        status: 'deploying',
      }

      it('should add the catalysts and their status to the store', () => {
        expect(
          apiReducer(initialState, fetchCatalystSuccess(catalyst))
        ).toEqual({
          ...INITIAL_STATE,
          loading: [],
          catalyst,
        })
      })
    })
  })

  describe(`when reducing the ${FETCH_INFO_SUCCESS} action`, () => {
    const initialState = {
      ...INITIAL_STATE,
      loading: loadingReducer([], fetchInfoRequest()),
    }

    const info: InfoResponse = {
      baseParcel: '1,2',
      parcels: [],
      rootCID: 'rootCID',
      debug: false,
      skipValidations: false,
      isPortableExperience: false,
      isWorld: false
    }

    it('should add the info to the store', () => {
      expect(apiReducer(initialState, fetchInfoSuccess(info))).toEqual({
        ...INITIAL_STATE,
        loading: [],
        info: { ...info, baseParcel: { x: 1, y: 2 } },
      })
    })
  })

  describe(`when reducing the ${UPDATE_DEPLOY_STATE} action`, () => {
    let initialState: ApiState
    let deployState: DeployState

    beforeEach(() => {
      initialState = { ...INITIAL_STATE }
      deployState = {
        phase: 'uploading',
        upload: {
          stage: 'uploading',
          sentBytes: 10,
          totalBytes: 100,
          completedBatches: null,
          totalBatches: null,
        },
        result: null,
        error: null,
      }
    })

    it('should store the deployment state', () => {
      expect(
        apiReducer(initialState, updateDeployState(deployState)),
      ).toEqual({ ...INITIAL_STATE, deployState })
    })
  })

  describe(`when reducing the ${CANCEL_DEPLOY_REQUEST} action`, () => {
    let initialState: ApiState

    beforeEach(() => {
      initialState = { ...INITIAL_STATE, cancelDeployError: error }
    })

    it('should set the loading state and clear the previous cancel error', () => {
      expect(apiReducer(initialState, cancelDeployRequest())).toEqual({
        ...INITIAL_STATE,
        loading: [cancelDeployRequest()],
        cancelDeployError: null,
      })
    })
  })

  describe(`when reducing the ${CANCEL_DEPLOY_SUCCESS} action`, () => {
    let initialState: ApiState
    let currentState: DeployState

    beforeEach(() => {
      currentState = {
        phase: 'uploading',
        upload: null,
        result: null,
        error: null,
      }
      initialState = {
        ...INITIAL_STATE,
        loading: [cancelDeployRequest()],
        deployState: currentState,
      }
    })

    describe('and the returned state is not final', () => {
      let returnedState: DeployState

      beforeEach(() => {
        returnedState = { ...currentState, phase: 'undeploying' }
      })

      it('should clear the loading state and keep the current deployment state', () => {
        expect(
          apiReducer(initialState, cancelDeploySuccess(returnedState)),
        ).toEqual({ ...INITIAL_STATE, deployState: currentState })
      })
    })

    describe('and the returned state is final', () => {
      let returnedState: DeployState

      beforeEach(() => {
        returnedState = { ...currentState, phase: 'cancelled' }
      })

      it('should clear the loading state and store the returned deployment state', () => {
        expect(
          apiReducer(initialState, cancelDeploySuccess(returnedState)),
        ).toEqual({ ...INITIAL_STATE, deployState: returnedState })
      })
    })
  })

  describe(`when reducing the ${CANCEL_DEPLOY_FAILURE} action`, () => {
    let initialState: ApiState

    beforeEach(() => {
      initialState = { ...INITIAL_STATE, loading: [cancelDeployRequest()] }
    })

    it('should clear the loading state and store the cancel error', () => {
      expect(apiReducer(initialState, cancelDeployFailure(error))).toEqual({
        ...INITIAL_STATE,
        cancelDeployError: error,
      })
    })
  })
})
