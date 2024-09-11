import { AuthIdentity, AuthLinkType } from '@dcl/crypto'
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
  SIGN_PUT_WORLD_ACL_REQUEST,
  SIGN_PUT_WORLD_ACL_SUCCESS,
  SIGN_PUT_WORLD_ACL_FAILURE,
  SIGN_DELETE_WORLD_ACL_REQUEST,
  SIGN_DELETE_WORLD_ACL_SUCCESS,
  SIGN_DELETE_WORLD_ACL_FAILURE,
  signPutWorldACLRequest,
  signPutWorldACLSuccess,
  signPutWorldACLFailure,
  signDeleteWorldACLRequest,
  signDeleteWorldACLSuccess,
  signDeleteWorldACLFailure,
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
    const authChain = [
      {
        type: AuthLinkType.ECDSA_PERSONAL_EPHEMERAL,
        payload: 'abcd',
        signature: 'signedMessage',
      },
    ]

    it('should return an object representing the action', () => {
      expect(signContentSuccess(authChain)).toEqual({
        type: SIGN_CONTENT_SUCCESS,
        meta: undefined,
        payload: { authChain },
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

  describe('when creating the action to signal the start of the sign put world ACL request', () => {
    const payload = '{ "resource": "resource", "allowed": ["0xaddress"] }'

    it('should return an object representing the action', () => {
      expect(signPutWorldACLRequest(payload)).toEqual({
        type: SIGN_PUT_WORLD_ACL_REQUEST,
        meta: undefined,
        payload,
      })
    })
  })

  describe('when creating the action to signal a success in the sign put world ACL request', () => {
    const authChain = [
      {
        type: AuthLinkType.ECDSA_PERSONAL_EPHEMERAL,
        payload: 'abcd',
        signature: 'signedMessage',
      },
    ]

    it('should return an object representing the action', () => {
      expect(signPutWorldACLSuccess(authChain)).toEqual({
        type: SIGN_PUT_WORLD_ACL_SUCCESS,
        meta: undefined,
        payload: { authChain },
      })
    })
  })

  describe('when creating the action to signal a failure in the sign put world ACL request', () => {
    it('should return an object representing the action', () => {
      expect(signPutWorldACLFailure(error)).toEqual({
        type: SIGN_PUT_WORLD_ACL_FAILURE,
        meta: undefined,
        payload: { error },
      })
    })
  })

  describe('when creating the action to signal the start of the sign delete world ACL request', () => {
    const payload = '{ "resource": "resource", "allowed": ["0xaddress"] }'

    it('should return an object representing the action', () => {
      expect(signDeleteWorldACLRequest(payload)).toEqual({
        type: SIGN_DELETE_WORLD_ACL_REQUEST,
        meta: undefined,
        payload,
      })
    })
  })

  describe('when creating the action to signal a success in the sign delete world ACL request', () => {
    const authChain = [
      {
        type: AuthLinkType.ECDSA_PERSONAL_EPHEMERAL,
        payload: 'abcd',
        signature: 'signedMessage',
      },
    ]

    it('should return an object representing the action', () => {
      expect(signDeleteWorldACLSuccess(authChain)).toEqual({
        type: SIGN_DELETE_WORLD_ACL_SUCCESS,
        meta: undefined,
        payload: { authChain },
      })
    })
  })

  describe('when creating the action to signal a failure in the sign delete world ACL request', () => {
    it('should return an object representing the action', () => {
      expect(signDeleteWorldACLFailure(error)).toEqual({
        type: SIGN_DELETE_WORLD_ACL_FAILURE,
        meta: undefined,
        payload: { error },
      })
    })
  })

  describe('when creating the action to signal the start of the sign quests request', () => {
    expect(signQuestsRequest('get:/api/creators/0xA/quests')).toEqual({
      type: SIGN_QUESTS_REQUEST,
      payload: 'get:/api/creators/0xA/quests',
    })
  })

  describe('when creating the action to signal the failure of the sign quests request', () => {
    const authChain = [
      {
        type: AuthLinkType.ECDSA_PERSONAL_EPHEMERAL,
        payload: 'abcd',
        signature: 'signedMessage',
      },
    ]
    expect(signQuestsSuccess(authChain)).toEqual({
      type: SIGN_QUESTS_SUCCESS,
      payload: { authChain: authChain },
    })
  })

  describe('when creating the action to signal the failure of the sign quests request', () => {
    expect(signQuestsFailure('error')).toEqual({
      type: SIGN_QUESTS_FAILURE,
      payload: { error: 'error' },
    })
  })
})
