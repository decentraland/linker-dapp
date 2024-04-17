import { expectSaga } from 'redux-saga-test-plan'
import { call, select } from 'redux-saga/effects'
import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'
import {
  fetchCatalystFailure,
  fetchCatalystRequest,
  fetchCatalystSuccess,
  fetchFilesFailure,
  fetchFilesRequest,
  fetchFilesSuccess,
  fetchInfoFailure,
  fetchInfoRequest,
  fetchInfoSuccess,
} from './actions'
import { CatalystResponse, FileSize } from './reducer'
import { apiSaga } from './sagas'
import { InfoResponse } from './types'
import { getCatalystsPointer, getFilesRequest, getInfoRequest } from './utils'

describe('server sagas', () => {
  const error = 'error'

  describe('when handling the fetch files request', () => {
    describe('when the request fails', () => {
      it('should dispatch an action signaling the failure of the action', () => {
        return expectSaga(apiSaga)
          .provide([[call(getFilesRequest), Promise.reject(new Error(error))]])
          .put(fetchFilesFailure(error))
          .dispatch(fetchFilesRequest())
          .run({ silenceTimeout: true })
      })
    })

    describe('when the request succeeds', () => {
      const files: FileSize[] = []
      it('should dispatch an action signaling the success of the action', () => {
        return expectSaga(apiSaga)
          .provide([[call(getFilesRequest), files]])
          .put(fetchFilesSuccess(files))
          .dispatch(fetchFilesRequest())
          .run({ silenceTimeout: true })
      })
    })
  })

  describe('when handling the fetch info request', () => {
    describe('when the request fails', () => {
      it('should dispatch an action signaling the failure of the action', () => {
        return expectSaga(apiSaga)
          .provide([[call(getInfoRequest), Promise.reject(new Error(error))]])
          .put(fetchInfoFailure(error))
          .dispatch(fetchInfoRequest())
          .run({ silenceTimeout: true })
      })
    })

    describe('when the request succeeds', () => {
      const info = {} as InfoResponse
      it('should dispatch an action signaling the success of the action', () => {
        return expectSaga(apiSaga)
          .provide([[call(getInfoRequest), info]])
          .put(fetchInfoSuccess(info))
          .dispatch(fetchInfoRequest())
          .run({ silenceTimeout: true })
      })
    })
  })

  describe('when handling the fetch catalyst request', () => {
    describe('when the request fails', () => {
      it('should dispatch an action signaling the failure of the action', () => {
        return expectSaga(apiSaga)
          .provide([
            [call(getCatalystsPointer), Promise.reject(new Error(error))],
          ])
          .put(fetchCatalystFailure(error))
          .dispatch(fetchCatalystRequest())
          .run({ silenceTimeout: true })
      })
    })

    describe('when the request succeeds', () => {
      const catalyst = {} as CatalystResponse
      it('should dispatch an action signaling the success of the action', () => {
        return expectSaga(apiSaga)
          .provide([[call(getCatalystsPointer), catalyst]])
          .put(fetchCatalystSuccess(catalyst))
          .dispatch(fetchCatalystRequest())
          .run({ silenceTimeout: true })
      })
    })
  })
})
