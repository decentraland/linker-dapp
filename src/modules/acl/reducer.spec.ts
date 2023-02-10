import { loadingReducer } from 'decentraland-dapps/dist/modules/loading/reducer'
import {
  fetchInfoRequest,
  fetchInfoSuccess,
  fetchInfoFailure,
  fetchWorldACLRequest,
  fetchWorldACLSuccess,
  fetchWorldACLFailure,
  updateWorldACLRequest,
  updateWorldACLFailure,
  FETCH_INFO_REQUEST,
  FETCH_INFO_SUCCESS,
  FETCH_WORLD_ACL_SUCCESS,
  UPDATE_WORLD_ACL_SUCCESS,
  updateWorldACLSuccess,
} from './actions'
import { INITIAL_STATE, aclReducer, ACLResponse } from './reducer'
import { InfoResponse } from './types'

const error = 'error'

const requestActions = [
  fetchInfoRequest(),
  fetchWorldACLRequest('targetServer', 'worldName'),
  updateWorldACLRequest('signature'),
]

const failureActions = [
  { request: fetchInfoRequest(), failure: fetchInfoFailure(error) },
  {
    request: fetchWorldACLRequest('targetServer', 'worldName'),
    failure: fetchWorldACLFailure(error),
  },
  {
    request: updateWorldACLRequest('signature'),
    failure: updateWorldACLFailure(error),
  },
]

describe('acl reducer', () => {
  requestActions.forEach((action) => {
    describe(`when reducing the "${action.type}" action`, () => {
      it('should return a state with the loading set', () => {
        const initialState = {
          ...INITIAL_STATE,
          loading: [],
        }

        expect(aclReducer(initialState, action)).toEqual({
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

        expect(aclReducer(initialState, action.failure)).toEqual({
          ...INITIAL_STATE,
          error,
          loading: [],
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
      worldName: 'world.name.dcl.eth',
      allowed: ['0xD9370c94253f080272BA1c28E216146ecE809f4d'],
      targetServer: 'target.server',
      payload:
        '{"resource": "world.name.dcl.eth", "allowed": ["0xD9370c94253f080272BA1c28E216146ecE809f4d"] }',
    }

    it('should return a state with the the loaded items plus the fetched trending items and the loading state cleared', () => {
      expect(aclReducer(initialState, fetchInfoSuccess(info))).toEqual({
        ...INITIAL_STATE,
        loading: [],
        info,
      })
    })
  })

  describe(`when reducing the ${FETCH_WORLD_ACL_SUCCESS} action`, () => {
    const initialState = {
      ...INITIAL_STATE,
      loading: loadingReducer(
        [],
        fetchWorldACLRequest('targetServer', 'worldName')
      ),
    }

    const acl: ACLResponse = {
      resource: 'world.name.dcl.eth',
      allowed: ['0xD9370c94253f080272BA1c28E216146ecE809f4d'],
    }

    it('should return a state with the the loaded items plus the fetched trending items and the loading state cleared', () => {
      expect(aclReducer(initialState, fetchWorldACLSuccess(acl))).toEqual({
        ...INITIAL_STATE,
        loading: [],
        acl,
      })
    })
  })

  describe(`when reducing the ${UPDATE_WORLD_ACL_SUCCESS} action`, () => {
    const initialState = {
      ...INITIAL_STATE,
      loading: loadingReducer([], updateWorldACLRequest('signature')),
    }

    it('should return a state with the the loaded items plus the fetched trending items and the loading state cleared', () => {
      expect(aclReducer(initialState, updateWorldACLSuccess())).toEqual({
        ...INITIAL_STATE,
        loading: [],
      })
    })
  })
})