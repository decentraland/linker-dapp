import { ACLStatus } from '../../components/WorldACLPage/ACLStatus/types'
import { RootState } from '../../types'
import { fetchInfoRequest } from './actions'
import { ACLResponse, INITIAL_STATE } from './reducer'
import {
  getState,
  isLoading,
  getError,
  getInfo,
  getACL,
  getACLStatus,
} from './selectors'
import { InfoResponse } from './types'

let state: RootState

describe('acl descriptors', () => {
  beforeEach(() => {
    state = {
      acl: {
        ...INITIAL_STATE,
        info: {} as InfoResponse,
        acl: {} as ACLResponse,
        error: 'anError',
        loading: [],
      },
    } as any
  })

  describe("when getting the acl's state", () => {
    it('should return the state', () => {
      expect(getState(state)).toEqual(state.acl)
    })
  })

  describe('when getting the info of the state', () => {
    it('should return the data', () => {
      expect(getInfo(state)).toEqual(state.acl.info)
    })
  })

  describe('when getting the acl of the state', () => {
    it('should return the acl message', () => {
      expect(getACL(state)).toEqual(state.acl.acl)
    })
  })

  describe('when getting the error of the state', () => {
    it('should return the error message', () => {
      expect(getError(state)).toEqual(state.acl.error)
    })
  })

  describe('when getting if something is being loaded', () => {
    beforeEach(() => {
      state.acl.loading = []
    })

    describe('and nothing is being fetched', () => {
      beforeEach(() => {
        state.acl.loading = []
      })

      it('should return false', () => {
        expect(isLoading(state)).toBe(false)
      })
    })

    describe('and it is being fetched', () => {
      beforeEach(() => {
        state.acl.loading.push(fetchInfoRequest())
      })

      it('should return true', () => {
        expect(isLoading(state)).toBe(true)
      })
    })
  })

  describe('when getting if the acl status', () => {
    beforeEach(() => {
      state.acl.info = undefined
      state.acl.acl = undefined
    })

    describe('and neither the info nor the acl were fetched', () => {
      it('should return false', () => {
        expect(getACLStatus(state)).toBe(ACLStatus.UPDATING)
      })
    })

    describe('when the info was fetched but the acl was not', () => {
      beforeEach(() => {
        state.acl.info = {} as InfoResponse
      })

      it('should return false', () => {
        expect(getACLStatus(state)).toBe(ACLStatus.UPDATING)
      })
    })

    describe('when the acl has not been updated yet with the last info data', () => {
      beforeEach(() => {
        state.acl.info = { worldName: 'a-world-name' } as InfoResponse
        state.acl.acl = { resource: 'another-world-name' } as ACLResponse
      })

      it('should return false', () => {
        expect(getACLStatus(state)).toBe(ACLStatus.UPDATING)
      })
    })

    describe('when the acl has not been updated yet with the last info data', () => {
      const worldName = 'a-world-name'
      beforeEach(() => {
        state.acl.info = {
          worldName,
          allowed: [
            '0xD9370c94253f080272BA1c28E216146ecE809f4d',
            '0xD9370c94253f080272BA1c28E216146ecE809f4f',
          ],
        } as InfoResponse
        state.acl.acl = {
          resource: worldName,
          allowed: ['0xD9370c94253f080272BA1c28E216146ecE809f4d'],
        } as ACLResponse
      })

      it('should return false', () => {
        expect(getACLStatus(state)).toBe(ACLStatus.UPDATING)
      })
    })

    describe('when the acl has been updated', () => {
      const worldName = 'a-world-name'
      const allowed = [
        '0xD9370c94253f080272BA1c28E216146ecE809f4d',
        '0xD9370c94253f080272BA1c28E216146ecE809f4f',
      ]

      beforeEach(() => {
        state.acl.info = {
          worldName,
          allowed,
        } as InfoResponse
        state.acl.acl = {
          resource: worldName,
          allowed,
        } as ACLResponse
      })

      it('should return false', () => {
        expect(getACLStatus(state)).toBe(ACLStatus.UPDATED)
      })
    })
  })
})
