import { loadingReducer } from 'decentraland-dapps/dist/modules/loading/reducer'
import {
  fetchAuthorizationsFailure,
  fetchAuthorizationsRequest,
  fetchAuthorizationsSuccess,
  FETCH_AUTHORIZATIONS_SUCCESS,
} from './actions'
import { INITIAL_STATE, authorizationReducer } from './reducer'
import { Authorization } from './types'

const error = 'error'

const requestActions = [fetchAuthorizationsRequest('owner')]

const failureActions = [
  {
    request: fetchAuthorizationsRequest('owner'),
    failure: fetchAuthorizationsFailure(error),
  },
]

describe('authorization reducer', () => {
  requestActions.forEach((action) => {
    describe(`when reducing the "${action.type}" action`, () => {
      it('should return a state with the loading set', () => {
        const initialState = {
          ...INITIAL_STATE,
          loading: [],
        }

        expect(authorizationReducer(initialState, action)).toEqual({
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

        expect(authorizationReducer(initialState, action.failure)).toEqual({
          ...INITIAL_STATE,
          error,
          loading: [],
        })
      })
    })
  })

  describe(`when reducing the ${FETCH_AUTHORIZATIONS_SUCCESS} action`, () => {
    const initialState = {
      ...INITIAL_STATE,
      loading: loadingReducer([], fetchAuthorizationsRequest('owner')),
    }

    const authorizations: Authorization[] = [
      { x: 1, y: 2, isUpdateAuthorized: false },
      { x: 30, y: -5, isUpdateAuthorized: true },
    ]

    it('should add the authorizations to the store', () => {
      expect(
        authorizationReducer(
          initialState,
          fetchAuthorizationsSuccess(authorizations)
        )
      ).toEqual({
        ...INITIAL_STATE,
        loading: [],
        error: null,
        data: authorizations,
      })
    })
  })
})
