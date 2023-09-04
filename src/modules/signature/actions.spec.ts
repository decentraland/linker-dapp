import { AuthIdentity } from 'dcl-crypto'
import {
  SIGN_CONTENT_REQUEST,
  SIGN_CONTENT_SUCCESS,
  SIGN_CONTENT_FAILURE,
  signContentRequest,
  signContentSuccess,
  signContentFailure,
  CREATE_IDENTITY_REQUEST,
  CREATE_IDENTITY_SUCCESS,
  CREATE_IDENTITY_FAILURE,
  createIdentityRequest,
  createIdentitySuccess,
  createIdentityFailure,
  SIGN_WORLD_ACL_REQUEST,
  SIGN_WORLD_ACL_SUCCESS,
  SIGN_WORLD_ACL_FAILURE,
  signWorldACLRequest,
  signWorldACLSuccess,
  signWorldACLFailure,
  signQuestsRequest,
  SIGN_QUESTS_REQUEST,
  signQuestsSuccess,
  SIGN_QUESTS_SUCCESS,
  SIGN_QUESTS_FAILURE,
  signQuestsFailure,
} from './actions'

describe('signature actions', () => {
  const error = 'error'

  describe('when creating the action to signal the start of the sign content request', () => {
    const cid = 'CID'

    it('should return an object representing the action', () => {
      expect(signContentRequest(cid)).toEqual({
        type: SIGN_CONTENT_REQUEST,
        meta: undefined,
        payload: cid,
      })
    })
  })

  describe('when creating the action to signal a success in the sign content request', () => {
    const signature = 'signature'

    it('should return an object representing the action', () => {
      expect(signContentSuccess(signature)).toEqual({
        type: SIGN_CONTENT_SUCCESS,
        meta: undefined,
        payload: { signature },
      })
    })
  })

  describe('when creating the action to signal a failure in the sign content request', () => {
    it('should return an object representing the action', () => {
      expect(signContentFailure(error)).toEqual({
        type: SIGN_CONTENT_FAILURE,
        meta: undefined,
        payload: { error },
      })
    })
  })

  describe('when creating the action to signal the start of the create identity request', () => {
    it('should return an object representing the action', () => {
      expect(createIdentityRequest()).toEqual({
        type: CREATE_IDENTITY_REQUEST,
        meta: undefined,
        payload: {},
      })
    })
  })

  describe('when creating the action to signal a success in the create identity request', () => {
    const identity: AuthIdentity = {
      ephemeralIdentity: {
        privateKey: 'private-key',
        publicKey: 'public-key',
        address: '0xaddress',
      },
      expiration: new Date(),
      authChain: [],
    }

    it('should return an object representing the action', () => {
      expect(createIdentitySuccess(identity)).toEqual({
        type: CREATE_IDENTITY_SUCCESS,
        meta: undefined,
        payload: { identity },
      })
    })
  })

  describe('when creating the action to signal a failure in the create identity request', () => {
    it('should return an object representing the action', () => {
      expect(createIdentityFailure(error)).toEqual({
        type: CREATE_IDENTITY_FAILURE,
        meta: undefined,
        payload: { error },
      })
    })
  })

  describe('when creating the action to signal the start of the sign world ACL request', () => {
    const payload = '{ "resource": "resource", "allowed": ["0xaddress"] }'

    it('should return an object representing the action', () => {
      expect(signWorldACLRequest(payload)).toEqual({
        type: SIGN_WORLD_ACL_REQUEST,
        meta: undefined,
        payload,
      })
    })
  })

  describe('when creating the action to signal a success in the sign world ACL request', () => {
    const signature = 'signature'

    it('should return an object representing the action', () => {
      expect(signWorldACLSuccess(signature)).toEqual({
        type: SIGN_WORLD_ACL_SUCCESS,
        meta: undefined,
        payload: { signature },
      })
    })
  })

  describe('when creating the action to signal a failure in the sign world ACL request', () => {
    it('should return an object representing the action', () => {
      expect(signWorldACLFailure(error)).toEqual({
        type: SIGN_WORLD_ACL_FAILURE,
        meta: undefined,
        payload: { error },
      })
    })
  })

  describe('when creating the action to signal the start of the sign quests request', () => {
    expect(signQuestsRequest("get:/api/creators/0xA/quests")).toEqual({
      type: SIGN_QUESTS_REQUEST,
      payload: "get:/api/creators/0xA/quests",
    })
  })

  describe('when creating the action to signal the failure of the sign quests request', () => {
    expect(signQuestsSuccess("0xbascd")).toEqual({
      type: SIGN_QUESTS_SUCCESS,
      payload: { signature: "0xbascd" },
    })
  })

  describe('when creating the action to signal the failure of the sign quests request', () => {
    expect(signQuestsFailure("error")).toEqual({
      type: SIGN_QUESTS_FAILURE,
      payload: { error: "error" },
    })
  })
})
