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
  deleteWorldACLSuccess,
  deleteWorldACLFailure,
  FETCH_INFO_REQUEST,
  FETCH_INFO_SUCCESS,
  FETCH_INFO_FAILURE,
  FETCH_WORLD_ACL_FAILURE,
  FETCH_WORLD_ACL_REQUEST,
  FETCH_WORLD_ACL_SUCCESS,
  PUT_WORLD_ACL_FAILURE,
  PUT_WORLD_ACL_REQUEST,
  PUT_WORLD_ACL_SUCCESS,
  DELETE_WORLD_ACL_FAILURE,
  DELETE_WORLD_ACL_REQUEST,
  DELETE_WORLD_ACL_SUCCESS,
} from './actions'
import { WorldPermissionType, WorldPermissionsResponse } from './reducer'
import { InfoResponse } from './types'

describe('acl actions', () => {
  const error = 'error'

  describe('when creating the action to signal the start of the fetch info request', () => {
    it('should return an object representing the action', () => {
      expect(fetchInfoRequest()).toEqual({
        type: FETCH_INFO_REQUEST,
        meta: undefined,
        payload: undefined,
      })
    })
  })

  describe('when creating the action to signal a success in the fetch info request', () => {
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

    it('should return an object representing the action', () => {
      expect(fetchInfoSuccess(info)).toEqual({
        type: FETCH_INFO_SUCCESS,
        meta: undefined,
        payload: { info },
      })
    })
  })

  describe('when creating the action to signal a failure in the fetch info request', () => {
    it('should return an object representing the action', () => {
      expect(fetchInfoFailure(error)).toEqual({
        type: FETCH_INFO_FAILURE,
        meta: undefined,
        payload: { error },
      })
    })
  })

  describe('when creating the action to signal the start of the fetch world ACL request', () => {
    const targetContent = 'targetContent'
    const worldName = 'worldName'

    it('should return an object representing the action', () => {
      expect(fetchWorldACLRequest(targetContent, worldName)).toEqual({
        type: FETCH_WORLD_ACL_REQUEST,
        meta: undefined,
        payload: { targetContent: targetContent, worldName },
      })
    })
  })

  describe('when creating the action to signal a success in the fetch world ACL request', () => {
    const permissions: WorldPermissionsResponse = {
      permissions: {
        deployment: {
          wallets: ['0xD9370c94253f080272BA1c28E216146ecE809f4d'],
          type: WorldPermissionType.AllowList
        },
      }
    }

    it('should return an object representing the action', () => {
      expect(fetchWorldACLSuccess(permissions, 'world.name.dcl.eth')).toEqual({
        type: FETCH_WORLD_ACL_SUCCESS,
        meta: undefined,
        payload: { acl: permissions, worldName: 'world.name.dcl.eth'},
      })
    })
  })

  describe('when creating the action to signal a failure in the fetch world ACL request', () => {
    it('should return an object representing the action', () => {
      expect(fetchWorldACLFailure(error)).toEqual({
        type: FETCH_WORLD_ACL_FAILURE,
        meta: undefined,
        payload: { error },
      })
    })
  })

  describe('when creating the action to signal the start of the put world ACL request', () => {
    const signature = 'signature'

    it('should return an object representing the action', () => {
      expect(putWorldACLRequest(signature)).toEqual({
        type: PUT_WORLD_ACL_REQUEST,
        meta: undefined,
        payload: { signature },
      })
    })
  })

  describe('when creating the action to signal a success in the put world ACL request', () => {
    it('should return an object representing the action', () => {
      expect(putWorldACLSuccess()).toEqual({
        type: PUT_WORLD_ACL_SUCCESS,
        meta: undefined,
        payload: undefined,
      })
    })
  })

  describe('when creating the action to signal a failure in the put world ACL request', () => {
    it('should return an object representing the action', () => {
      expect(putWorldACLFailure(error)).toEqual({
        type: PUT_WORLD_ACL_FAILURE,
        meta: undefined,
        payload: { error },
      })
    })
  })

  describe('when creating the action to signal the start of the delete world ACL request', () => {
    const signature = 'signature'

    it('should return an object representing the action', () => {
      expect(deleteWorldACLRequest(signature)).toEqual({
        type: DELETE_WORLD_ACL_REQUEST,
        meta: undefined,
        payload: { signature },
      })
    })
  })

  describe('when creating the action to signal a success in the delete world ACL request', () => {
    it('should return an object representing the action', () => {
      expect(deleteWorldACLSuccess()).toEqual({
        type: DELETE_WORLD_ACL_SUCCESS,
        meta: undefined,
        payload: undefined,
      })
    })
  })

  describe('when creating the action to signal a failure in the delete world ACL request', () => {
    it('should return an object representing the action', () => {
      expect(deleteWorldACLFailure(error)).toEqual({
        type: DELETE_WORLD_ACL_FAILURE,
        meta: undefined,
        payload: { error },
      })
    })
  })
})
