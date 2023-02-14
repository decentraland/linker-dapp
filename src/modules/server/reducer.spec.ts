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
} from './actions'
import {
  INITIAL_STATE,
  apiReducer,
  CatalystResponse,
  FileSize,
} from './reducer'
import { InfoResponse } from './types'

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
    }

    it('should add the info to the store', () => {
      expect(apiReducer(initialState, fetchInfoSuccess(info))).toEqual({
        ...INITIAL_STATE,
        loading: [],
        info: { ...info, baseParcel: { x: 1, y: 2 } },
      })
    })
  })
})
