import { AuthIdentity } from 'dcl-crypto'
import { RootState } from '../../types'
import { signContentRequest } from './actions'
import { INITIAL_STATE } from './reducer'
import { getState, isLoading, getError, getData } from './selectors'

let state: RootState

describe('signature selectors', () => {
  beforeEach(() => {
    state = {
      signature: {
        ...INITIAL_STATE,
        data: [],
        identity: {} as AuthIdentity,
        error: 'anError',
        loading: [],
      },
    } as any
  })

  describe("when getting the signatures's state", () => {
    it('should return the state', () => {
      expect(getState(state)).toEqual(state.signature)
    })
  })

  describe('when getting the data of the state', () => {
    it('should return the data', () => {
      expect(getData(state)).toEqual(state.signature.data)
    })
  })

  describe('when getting the error of the state', () => {
    it('should return the error message', () => {
      expect(getError(state)).toEqual(state.signature.error)
    })
  })

  describe('when getting if something is being loaded', () => {
    beforeEach(() => {
      state.signature.loading = []
    })

    describe('and nothing is being fetched', () => {
      beforeEach(() => {
        state.signature.loading = []
      })

      it('should return false', () => {
        expect(isLoading(state)).toBe(false)
      })
    })

    describe('and it is being fetched', () => {
      beforeEach(() => {
        state.signature.loading.push(signContentRequest('owner'))
      })

      it('should return true', () => {
        expect(isLoading(state)).toBe(true)
      })
    })
  })
})
