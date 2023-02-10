import { RootState } from '../../types'
import { fetchAuthorizationsRequest } from './actions'
import { INITIAL_STATE } from './reducer'
import {
  getState,
  isLoading,
  getError,
  getData,
  isUpdateAuthorized,
} from './selectors'

let state: RootState

describe('autorization selectors', () => {
  beforeEach(() => {
    state = {
      authorization: {
        ...INITIAL_STATE,
        data: [],
        error: 'anError',
        loading: [],
      },
    } as any
  })

  describe("when getting the authorization's state", () => {
    it('should return the state', () => {
      expect(getState(state)).toEqual(state.authorization)
    })
  })

  describe('when getting the data of the state', () => {
    it('should return the data', () => {
      expect(getData(state)).toEqual(state.authorization.data)
    })
  })

  describe('when getting the error of the state', () => {
    it('should return the error message', () => {
      expect(getError(state)).toEqual(state.authorization.error)
    })
  })

  describe('when getting if something is being loaded', () => {
    beforeEach(() => {
      state.authorization.loading = []
    })

    describe('and nothing is being fetched', () => {
      beforeEach(() => {
        state.authorization.loading = []
      })

      it('should return false', () => {
        expect(isLoading(state)).toBe(false)
      })
    })

    describe('and it is being fetched', () => {
      beforeEach(() => {
        state.authorization.loading.push(fetchAuthorizationsRequest('owner'))
      })

      it('should return true', () => {
        expect(isLoading(state)).toBe(true)
      })
    })
  })

  describe('when getting the update is authorized', () => {
    beforeEach(() => {
      state.authorization.data = []
    })

    describe('and there is not authorizations', () => {
      it('should return undefined', () => {
        expect(isUpdateAuthorized(state)).toBeUndefined()
      })
    })

    describe('and there are authorizations', () => {
      describe('and some of are not auhtorized', () => {
        beforeEach(() => {
          state.authorization.data.push(
            { x: 1, y: 2, isUpdateAuthorized: false },
            { x: 11, y: 22, isUpdateAuthorized: true }
          )
        })

        it('should return false', () => {
          expect(isUpdateAuthorized(state)).toBe(false)
        })
      })

      describe('and all of them are auhtorized', () => {
        beforeEach(() => {
          state.authorization.data.push(
            { x: 1, y: 2, isUpdateAuthorized: true },
            { x: 11, y: 22, isUpdateAuthorized: true }
          )
        })

        it('should return true', () => {
          expect(isUpdateAuthorized(state)).toBe(true)
        })
      })
    })
  })
})
