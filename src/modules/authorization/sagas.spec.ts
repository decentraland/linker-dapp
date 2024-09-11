import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { expectSaga } from 'redux-saga-test-plan'
import { put, select } from 'redux-saga/effects'
import { Coords } from '../land/types'
import { FETCH_INFO_SUCCESS } from '../server/actions'
import { Info } from '../server/reducer'
import { getInfo } from '../server/selectors'
import {
  fetchAuthorizationsFailure,
  fetchAuthorizationsRequest,
  fetchAuthorizationsSuccess,
} from './actions'
import { authorizationSaga } from './sagas'
import { isAuthorized } from './utils'

jest.mock('./utils', () => {
  const originalModule = jest.requireActual('./utils')

  return {
    __esModule: true,
    ...originalModule,
    isAuthorized: jest.fn(),
  }
})

const isAuthorizedMock = isAuthorized as jest.MockedFunction<
  typeof isAuthorized
>

describe('authorization sagas', () => {
  const error = 'error'
  const info: Info = {
    rootCID: 'rootCID',
    debug: false,
    baseParcel: {
      x: 0,
      y: 0,
    },
    parcels: [],
    isPortableExperience: false,
    isWorld: false,
  }
  const owner = '0xowner'
  const address = '0xaddress'

  describe('when handling the fetch authorizations request', () => {
    describe('when the info has not been loaded', () => {
      it('should wait for the action signaling the success of the fetch info request', () => {
        return expectSaga(authorizationSaga)
          .provide([[select(getInfo), null]])
          .take(FETCH_INFO_SUCCESS)
          .dispatch(fetchAuthorizationsRequest(owner))
          .run({ silenceTimeout: true })
      })
    })

    describe('when the url has a flag to skip the validations', () => {
      beforeAll(() => {
        window.history.pushState({}, '', '?skipValidations=true')
      })

      it('should dispatch an action signaling the success of the fetch authorization request', () => {
        return expectSaga(authorizationSaga)
          .provide([
            [select(getInfo), info],
            [select(getAddress), address],
          ])
          .put(fetchAuthorizationsSuccess([]))
          .dispatch(fetchAuthorizationsRequest(owner))
          .run({ silenceTimeout: true })
      })

      it('if there is an unexpected error should dispatch an action signaling the failure of the fetch authorization request', () => {
        return expectSaga(authorizationSaga)
          .provide([
            [select(getInfo), info],
            [select(getAddress), address],
            [
              put(fetchAuthorizationsSuccess([])),
              Promise.reject(new Error(error)),
            ],
          ])
          .put(fetchAuthorizationsFailure(error))
          .dispatch(fetchAuthorizationsRequest(owner))
          .run({ silenceTimeout: true })
      })
    })

    describe('when the url does not have the skip validations flag or if it is false', () => {
      beforeAll(() => {
        window.history.pushState({}, '', '?skipValidations=false')
      })

      it('should dispatch an action signaling the success of the fetch authorization request', () => {
        return expectSaga(authorizationSaga)
          .provide([
            [select(getInfo), info],
            [select(getAddress), address],
          ])
          .put(fetchAuthorizationsSuccess([]))
          .dispatch(fetchAuthorizationsRequest(owner))
          .run({ silenceTimeout: true })
      })

      it('if there is an unexpected error should dispatch an action signaling the failure of the fetch authorization request', () => {
        isAuthorizedMock.mockRejectedValue(new Error(error))

        return expectSaga(authorizationSaga)
          .provide([
            [select(getInfo), { ...info, parcels: [{} as Coords[]] }],
            [select(getAddress), address],
          ])
          .put(fetchAuthorizationsFailure(error))
          .dispatch(fetchAuthorizationsRequest(owner))
          .run({ silenceTimeout: true })
      })
    })
  })
})
