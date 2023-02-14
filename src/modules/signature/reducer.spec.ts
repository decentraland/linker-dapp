import { AuthIdentity } from 'dcl-crypto'
import { loadingReducer } from 'decentraland-dapps/dist/modules/loading/reducer'
import {
  SIGN_CONTENT_SUCCESS,
  CREATE_IDENTITY_SUCCESS,
  SIGN_WORLD_ACL_SUCCESS,
  signContentRequest,
  createIdentityRequest,
  signWorldACLRequest,
  createIdentityFailure,
  signContentFailure,
  signWorldACLFailure,
  signContentSuccess,
  createIdentitySuccess,
  signWorldACLSuccess,
} from './actions'
import { INITIAL_STATE, signatureReducer } from './reducer'

const error = 'error'

const requestActions = [
  signContentRequest('cid'),
  createIdentityRequest(),
  signWorldACLRequest('payload'),
]

const failureActions = [
  { request: signContentRequest('cid'), failure: signContentFailure(error) },
  { request: createIdentityRequest(), failure: createIdentityFailure(error) },
  {
    request: signWorldACLRequest('payload'),
    failure: signWorldACLFailure(error),
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

    const initialState = {
      ...INITIAL_STATE,
      loading: loadingReducer([], signContentRequest('cid')),
    }

    it('should add the cid to the store', () => {
      expect(signatureReducer(initialState, signContentSuccess(cid))).toEqual({
        ...INITIAL_STATE,
        loading: [],
        data: cid,
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

  describe(`when reducing the ${SIGN_WORLD_ACL_SUCCESS} action`, () => {
    const signature = 'signature'

    const initialState = {
      ...INITIAL_STATE,
      loading: loadingReducer([], signWorldACLRequest(signature)),
    }

    it('should add the signature to the store', () => {
      expect(
        signatureReducer(initialState, signWorldACLSuccess(signature))
      ).toEqual({
        ...INITIAL_STATE,
        loading: [],
        data: signature,
      })
    })
  })
})
