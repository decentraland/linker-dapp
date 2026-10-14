import {
  FETCH_FILES_REQUEST,
  FETCH_FILES_SUCCESS,
  FETCH_FILES_FAILURE,
  FETCH_INFO_REQUEST,
  FETCH_INFO_SUCCESS,
  FETCH_INFO_FAILURE,
  FETCH_CATALYST_REQUEST,
  FETCH_CATALYST_SUCCESS,
  FETCH_CATALYST_FAILURE,
  fetchFilesRequest,
  fetchFilesSuccess,
  fetchFilesFailure,
  fetchInfoRequest,
  fetchInfoSuccess,
  fetchInfoFailure,
  fetchCatalystRequest,
  fetchCatalystSuccess,
  fetchCatalystFailure,
  UPDATE_DEPLOY_STATE,
  CANCEL_DEPLOY_REQUEST,
  CANCEL_DEPLOY_SUCCESS,
  CANCEL_DEPLOY_FAILURE,
  updateDeployState,
  cancelDeployRequest,
  cancelDeploySuccess,
  cancelDeployFailure,
} from './actions'
import { CatalystResponse, FileSize } from './reducer'
import { DeployState, InfoResponse } from './types'

describe('server actions', () => {
  const error = 'error'

  describe('when creating the action to signal the start of the fetch files request', () => {
    it('should return an object representing the action', () => {
      expect(fetchFilesRequest()).toEqual({
        type: FETCH_FILES_REQUEST,
        meta: undefined,
        payload: undefined,
      })
    })
  })

  describe('when creating the action to signal a success in the fetch files request', () => {
    const files: FileSize[] = []

    it('should return an object representing the action', () => {
      expect(fetchFilesSuccess(files)).toEqual({
        type: FETCH_FILES_SUCCESS,
        meta: undefined,
        payload: { files },
      })
    })
  })

  describe('when creating the action to signal a failure in the fetch files request', () => {
    it('should return an object representing the action', () => {
      expect(fetchFilesFailure(error)).toEqual({
        type: FETCH_FILES_FAILURE,
        meta: undefined,
        payload: { error },
      })
    })
  })

  describe('when creating the action to signal the start of the fetch info request', () => {
    it('should return an object representing the action', () => {
      expect(fetchInfoRequest()).toEqual({
        type: FETCH_INFO_REQUEST,
        meta: undefined,
        payload: undefined,
      })
    })
  })

  describe('when creating the action to signal a success in the fetch info request', () => {
    const info: InfoResponse = {
      baseParcel: 'baseParcel',
      parcels: [],
      rootCID: 'rootCID',
      debug: false,
      skipValidations: false,
      isPortableExperience: false,
      isWorld: false
    }

    it('should return an object representing the action', () => {
      expect(fetchInfoSuccess(info)).toEqual({
        type: FETCH_INFO_SUCCESS,
        meta: undefined,
        payload: { info },
      })
    })
  })

  describe('when creating the action to signal a failure in the fetch info request', () => {
    it('should return an object representing the action', () => {
      expect(fetchInfoFailure(error)).toEqual({
        type: FETCH_INFO_FAILURE,
        meta: undefined,
        payload: { error },
      })
    })
  })

  describe('when creating the action to signal the start of the update catalyst request', () => {
    it('should return an object representing the action', () => {
      expect(fetchCatalystRequest()).toEqual({
        type: FETCH_CATALYST_REQUEST,
        meta: undefined,
        payload: undefined,
      })
    })
  })

  describe('when creating the action to signal a success in the update catalyst request', () => {
    const payload: CatalystResponse = {
      catalysts: [],
      status: 'deploying',
    }

    it('should return an object representing the action', () => {
      expect(fetchCatalystSuccess(payload)).toEqual({
        type: FETCH_CATALYST_SUCCESS,
        meta: undefined,
        payload,
      })
    })
  })

  describe('when creating the action to signal a failure in the update catalyst request', () => {
    it('should return an object representing the action', () => {
      expect(fetchCatalystFailure(error)).toEqual({
        type: FETCH_CATALYST_FAILURE,
        meta: undefined,
        payload: { error },
      })
    })
  })

  describe('when creating the action to update the deployment state', () => {
    let state: DeployState

    beforeEach(() => {
      state = { phase: 'uploading', upload: null, result: null, error: null }
    })

    it('should return an object representing the action', () => {
      expect(updateDeployState(state)).toEqual({
        type: UPDATE_DEPLOY_STATE,
        meta: undefined,
        payload: { state },
      })
    })
  })

  describe('when creating the action to signal the start of the cancel deploy request', () => {
    it('should return an object representing the action', () => {
      expect(cancelDeployRequest()).toEqual({
        type: CANCEL_DEPLOY_REQUEST,
        meta: undefined,
        payload: undefined,
      })
    })
  })

  describe('when creating the action to signal a success in the cancel deploy request', () => {
    let state: DeployState

    beforeEach(() => {
      state = { phase: 'cancelled', upload: null, result: null, error: null }
    })

    it('should return an object representing the action', () => {
      expect(cancelDeploySuccess(state)).toEqual({
        type: CANCEL_DEPLOY_SUCCESS,
        meta: undefined,
        payload: { state },
      })
    })
  })

  describe('when creating the action to signal a failure in the cancel deploy request', () => {
    it('should return an object representing the action', () => {
      expect(cancelDeployFailure(error)).toEqual({
        type: CANCEL_DEPLOY_FAILURE,
        meta: undefined,
        payload: { error },
      })
    })
  })
})
