import { loadingReducer } from 'decentraland-dapps/dist/modules/loading/reducer'
import {
  fetchInfoRequest,
  fetchInfoSuccess,
  fetchInfoFailure,
  fetchWorldACLRequest,
  fetchWorldACLSuccess,
  fetchWorldACLFailure,
  putWorldACLRequest,
  putWorldACLSuccess,
  putWorldACLFailure,
  deleteWorldACLRequest,
  deleteWorldACLFailure,
  FETCH_INFO_SUCCESS,
  FETCH_WORLD_ACL_SUCCESS,
  PUT_WORLD_ACL_SUCCESS,
  DELETE_WORLD_ACL_SUCCESS,
} from './actions'
import { INITIAL_STATE, aclReducer, WorldPermissionsResponse, WorldPermissionType } from './reducer'
import { InfoResponse } from './types'

const error = 'error'

const requestActions = [
  fetchInfoRequest(),
  fetchWorldACLRequest('targetContent', 'worldName'),
  putWorldACLRequest('signature'),
  deleteWorldACLRequest('signature'),
]

const failureActions = [
  { request: fetchInfoRequest(), failure: fetchInfoFailure(error) },
  {
    request: fetchWorldACLRequest('targetContent', 'worldName'),
    failure: fetchWorldACLFailure(error),
  },
  {
    request: putWorldACLRequest('signature'),
    failure: putWorldACLFailure(error),
  },
  {
    request: deleteWorldACLRequest('signature'),
    failure: deleteWorldACLFailure(error),
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
      oldAllowed: [],
      targetContent: 'target.content',
      timestamp: new Date('2023-03-03T15:22:56.493Z'),
      expiration: 120,
      method: 'put',
      payload:
        '{"resource": "world.name.dcl.eth", "allowed": ["0xD9370c94253f080272BA1c28E216146ecE809f4d"] }',
    }

    it('should add the info to the store', () => {
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
        fetchWorldACLRequest('targetContent', 'worldName')
      ),
    }

    const permissions: WorldPermissionsResponse = {
      permissions: {
        deployment: {
          type: WorldPermissionType.AllowList,
          wallets: ['0xD9370c94253f080272BA1c28E216146ecE809f4d'],
        },
      },
    }

    it('should add the acl to the store', () => {
      expect(aclReducer(initialState, fetchWorldACLSuccess(permissions, 'world.name.dcl.eth'))).toEqual({
        ...INITIAL_STATE,
        loading: [],
        acl: {resource: 'world.name.dcl.eth', allowed: permissions.permissions.deployment.wallets},
      })
    })
  })

  describe(`when reducing the ${PUT_WORLD_ACL_SUCCESS} action`, () => {
    const initialState = {
      ...INITIAL_STATE,
      loading: loadingReducer([], putWorldACLRequest('signature')),
    }

    it('should clear the loading state', () => {
      expect(aclReducer(initialState, putWorldACLSuccess())).toEqual({
        ...INITIAL_STATE,
        loading: [],
      })
    })
  })

  describe(`when reducing the ${DELETE_WORLD_ACL_SUCCESS} action`, () => {
    const initialState = {
      ...INITIAL_STATE,
      loading: loadingReducer([], putWorldACLRequest('signature')),
    }

    it('should clear the loading state', () => {
      expect(aclReducer(initialState, putWorldACLSuccess())).toEqual({
        ...INITIAL_STATE,
        loading: [],
      })
    })
  })
})
