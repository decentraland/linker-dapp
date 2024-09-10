import { AuthIdentity, AuthLinkType } from '@dcl/crypto'
import { loadingReducer } from 'decentraland-dapps/dist/modules/loading/reducer'
import {
  SIGN_CONTENT_SUCCESS,
  CREATE_IDENTITY_SUCCESS,
  SIGN_PUT_WORLD_ACL_SUCCESS,
  SIGN_DELETE_WORLD_ACL_SUCCESS,
  signContentRequest,
  createIdentityRequest,
  signPutWorldACLRequest,
  signDeleteWorldACLRequest,
  createIdentityFailure,
  signContentFailure,
  signPutWorldACLFailure,
  signDeleteWorldACLFailure,
  signContentSuccess,
  createIdentitySuccess,
  signPutWorldACLSuccess,
  signDeleteWorldACLSuccess,
} from './actions'
import { INITIAL_STATE, signatureReducer } from './reducer'

const error = 'error'

const requestActions = [
  signContentRequest('cid'),
  createIdentityRequest(),
  signPutWorldACLRequest('payload'),
  signDeleteWorldACLRequest('payload'),
]

const failureActions = [
  { request: signContentRequest('cid'), failure: signContentFailure(error) },
  { request: createIdentityRequest(), failure: createIdentityFailure(error) },
  {
    request: signPutWorldACLRequest('payload'),
    failure: signPutWorldACLFailure(error),
  },
  {
    request: signDeleteWorldACLRequest('payload'),
    failure: signDeleteWorldACLFailure(error),
  },
]

describe('signature reducer', () => {
  requestActions.forEach((action) => {
    describe(`when reducing the "${action.type}" action`, () => {
      it('should return a state with the loading set', () => {
        const initialState = {
          ...INITIAL_STATE,
          loading: [],
        }

        expect(signatureReducer(initialState, action)).toEqual({
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

        expect(signatureReducer(initialState, action.failure)).toEqual({
          ...INITIAL_STATE,
          error,
          loading: [],
        })
      })
    })
  })

  describe(`when reducing the ${SIGN_CONTENT_SUCCESS} action`, () => {
    const cid = 'cid'
    const authChain = [
      {
        type: AuthLinkType.ECDSA_PERSONAL_EPHEMERAL,
        payload: 'abcd',
        signature: 'signedMessage',
      },
    ]

    const initialState = {
      ...INITIAL_STATE,
      loading: loadingReducer([], signContentRequest('cid')),
    }

    it('should add the cid to the store', () => {
      expect(
        signatureReducer(initialState, signContentSuccess(authChain))
      ).toEqual({
        ...INITIAL_STATE,
        loading: [],
        data: authChain,
      })
    })
  })

  describe(`when reducing the ${CREATE_IDENTITY_SUCCESS} action`, () => {
    const initialState = {
      ...INITIAL_STATE,
      loading: loadingReducer([], createIdentityRequest()),
    }

    const identity: AuthIdentity = {
      ephemeralIdentity: {
        privateKey: 'private-key',
        publicKey: 'public-key',
        address: '0xaddress',
      },
      expiration: new Date(),
      authChain: [],
    }

    it('should add the new identity to the store', () => {
      expect(
        signatureReducer(initialState, createIdentitySuccess(identity))
      ).toEqual({
        ...INITIAL_STATE,
        loading: [],
        identity,
      })
    })
  })

  describe(`when reducing the ${SIGN_PUT_WORLD_ACL_SUCCESS} action`, () => {
    const signature = 'signature'
    const authChain = [
      {
        type: AuthLinkType.ECDSA_PERSONAL_EPHEMERAL,
        payload: 'abcd',
        signature: 'signedMessage',
      },
    ]

    const initialState = {
      ...INITIAL_STATE,
      loading: loadingReducer([], signPutWorldACLRequest(signature)),
    }

    it('should add the signature to the store', () => {
      expect(
        signatureReducer(initialState, signPutWorldACLSuccess(authChain))
      ).toEqual({
        ...INITIAL_STATE,
        loading: [],
        data: authChain,
      })
    })
  })

  describe(`when reducing the ${SIGN_DELETE_WORLD_ACL_SUCCESS} action`, () => {
    const signature = 'signature'
    const authChain = [
      {
        type: AuthLinkType.ECDSA_PERSONAL_EPHEMERAL,
        payload: 'abcd',
        signature: 'signedMessage',
      },
    ]

    const initialState = {
      ...INITIAL_STATE,
      loading: loadingReducer([], signDeleteWorldACLRequest(signature)),
    }

    it('should add the signature to the store', () => {
      expect(
        signatureReducer(initialState, signDeleteWorldACLSuccess(authChain))
      ).toEqual({
        ...INITIAL_STATE,
        loading: [],
        data: authChain,
      })
    })
  })
})
