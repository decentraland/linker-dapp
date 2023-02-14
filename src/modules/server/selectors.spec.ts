import { RootState } from '../../types'
import { fetchFilesRequest } from './actions'
import { CatalystResponse, INITIAL_STATE } from './reducer'
import { getInfo, isLoading, getError, getFiles } from './selectors'
import { InfoResponse } from './types'

let state: RootState

describe('server selectors', () => {
  beforeEach(() => {
    state = {
      api: {
        ...INITIAL_STATE,
        info: {} as InfoResponse,
        error: 'anError',
        loading: [],
        catalyst: {} as CatalystResponse,
      },
    } as any
  })

  describe('when getting the info of the state', () => {
    it('should return the data', () => {
      expect(getInfo(state)).toEqual(state.api.info)
    })
  })

  describe('when getting the files of the state', () => {
    it('should return the data', () => {
      expect(getFiles(state)).toEqual(state.api.files)
    })
  })

  describe('when getting the error of the state', () => {
    it('should return the error message', () => {
      expect(getError(state)).toEqual(state.api.error)
    })
  })

  describe('when getting if something is being loaded', () => {
    beforeEach(() => {
      state.api.loading = []
    })

    describe('and nothing is being fetched', () => {
      beforeEach(() => {
        state.api.loading = []
      })

      it('should return false', () => {
        expect(isLoading(state)).toBe(false)
      })
    })

    describe('and it is being fetched', () => {
      beforeEach(() => {
        state.api.loading.push(fetchFilesRequest())
      })

      it('should return true', () => {
        expect(isLoading(state)).toBe(true)
      })
    })
  })
})
