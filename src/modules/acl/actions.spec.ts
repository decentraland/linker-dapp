import {
  fetchInfoRequest,
  fetchInfoSuccess,
  fetchInfoFailure,
  fetchWorldACLRequest,
  fetchWorldACLSuccess,
  fetchWorldACLFailure,
  updateWorldACLRequest,
  updateWorldACLSuccess,
  updateWorldACLFailure,
  FETCH_INFO_REQUEST,
  FETCH_INFO_SUCCESS,
  FETCH_INFO_FAILURE,
  FETCH_WORLD_ACL_FAILURE,
  FETCH_WORLD_ACL_REQUEST,
  FETCH_WORLD_ACL_SUCCESS,
  UPDATE_WORLD_ACL_FAILURE,
  UPDATE_WORLD_ACL_REQUEST,
  UPDATE_WORLD_ACL_SUCCESS,
} from './actions'
import { ACLResponse } from './reducer'
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
    const acl: ACLResponse = {
      resource: 'world.name.dcl.eth',
      allowed: ['0xD9370c94253f080272BA1c28E216146ecE809f4d'],
    }

    it('should return an object representing the action', () => {
      expect(fetchWorldACLSuccess(acl)).toEqual({
        type: FETCH_WORLD_ACL_SUCCESS,
        meta: undefined,
        payload: { acl },
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

  describe('when creating the action to signal the start of the update world ACL request', () => {
    const signature = 'signature'

    it('should return an object representing the action', () => {
      expect(updateWorldACLRequest(signature)).toEqual({
        type: UPDATE_WORLD_ACL_REQUEST,
        meta: undefined,
        payload: { signature },
      })
    })
  })

  describe('when creating the action to signal a success in the update world ACL request', () => {
    it('should return an object representing the action', () => {
      expect(updateWorldACLSuccess()).toEqual({
        type: UPDATE_WORLD_ACL_SUCCESS,
        meta: undefined,
        payload: undefined,
      })
    })
  })

  describe('when creating the action to signal a failure in the update world ACL request', () => {
    it('should return an object representing the action', () => {
      expect(updateWorldACLFailure(error)).toEqual({
        type: UPDATE_WORLD_ACL_FAILURE,
        meta: undefined,
        payload: { error },
      })
    })
  })
})
