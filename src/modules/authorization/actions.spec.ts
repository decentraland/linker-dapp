import {
  fetchAuthorizationsFailure,
  fetchAuthorizationsRequest,
  fetchAuthorizationsSuccess,
  FETCH_AUTHORIZATIONS_FAILURE,
  FETCH_AUTHORIZATIONS_REQUEST,
  FETCH_AUTHORIZATIONS_SUCCESS,
} from './actions'
import { Authorization } from './types'

describe('authorization actions', () => {
  const error = 'error'

  describe('when creating the action to signal the start of the fetch authorization request', () => {
    const owner = 'owner'

    it('should return an object representing the action', () => {
      expect(fetchAuthorizationsRequest(owner)).toEqual({
        type: FETCH_AUTHORIZATIONS_REQUEST,
        meta: undefined,
        payload: { owner },
      })
    })
  })

  describe('when creating the action to signal a success in the fetch authorization request', () => {
    const authorization: Authorization = {
      x: 9,
      y: 12,
      isUpdateAuthorized: false,
    }
    const authorizations = [authorization]

    it('should return an object representing the action', () => {
      expect(fetchAuthorizationsSuccess(authorizations)).toEqual({
        type: FETCH_AUTHORIZATIONS_SUCCESS,
        meta: undefined,
        payload: { authorizations },
      })
    })
  })

  describe('when creating the action to signal a failure in the fetch authorization request', () => {
    it('should return an object representing the action', () => {
      expect(fetchAuthorizationsFailure(error)).toEqual({
        type: FETCH_AUTHORIZATIONS_FAILURE,
        meta: undefined,
        payload: { error },
      })
    })
  })
})
