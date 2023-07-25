/**
 * @jest-environment node
 */
// https://github.com/jsdom/jsdom/issues/2524#issuecomment-902027138

import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import { createIdentity } from '@dcl/builder-client'
import { ChainId } from '@dcl/schemas'
import { AuthIdentity } from 'dcl-crypto'
import { Provider } from 'decentraland-connect/dist'
import { getConnectedProvider } from 'decentraland-dapps/dist/lib/eth'
import {
  getAddress,
  getChainId,
} from 'decentraland-dapps/dist/modules/wallet/selectors'
import { expectSaga } from 'redux-saga-test-plan'
import { call, select } from 'redux-saga/effects'
import { updateWorldACLRequest } from '../acl/actions'
import { closeServer, postDeploy } from '../server/utils'
import { fetchCatalystRequest } from '../server/actions'
import {
  createIdentityFailure,
  createIdentityRequest,
  createIdentitySuccess,
  signContentFailure,
  signContentRequest,
  signContentSuccess,
  signWorldACLFailure,
  signWorldACLRequest,
  signWorldACLSuccess,
} from './actions'
import { signatureSaga } from './sagas'

jest.mock('@ethersproject/providers')
jest.mock('@dcl/builder-client')
jest.mock('decentraland-dapps/dist/lib/eth')

describe('signature sagas', () => {
  const error = 'error'
  const signature = 'signedMessage'
  const address = '0xanotherAddress'
  const chainId = ChainId.ETHEREUM_SEPOLIA

  const mockedGetConnectedProvider =
    getConnectedProvider as jest.MockedFunction<typeof getConnectedProvider>

  const mockedProvider = { send: jest.fn() } as unknown as Provider
  const mockedSigner = {
    getAddress: jest.fn(),
  } as unknown as JsonRpcSigner

  beforeEach(() => {
    jest
      .spyOn(Web3Provider.prototype, 'getSigner')
      .mockReturnValue(mockedSigner as never)
    jest.spyOn(mockedSigner, 'getAddress').mockResolvedValue('0xaddress')
    jest.spyOn(mockedProvider, 'send').mockResolvedValue(signature)
  })

  describe('when handling the sign content request', () => {
    describe('when the request fails', () => {
      beforeEach(() => {
        mockedGetConnectedProvider.mockRejectedValue(new Error(error))
      })

      it('should dispatch an action signaling the failure of the action', () => {
        return expectSaga(signatureSaga)
          .put(signContentFailure(error))
          .dispatch(signContentRequest('cid'))
          .run({ silenceTimeout: true })
      })
    })

    describe('when the request succeeds', () => {
      beforeEach(() => {
        mockedGetConnectedProvider.mockResolvedValue(mockedProvider)
      })

      it('should dispatch an action signaling the success of the action and execute the postDeploy request', () => {
        return expectSaga(signatureSaga)
          .provide([
            [select(getAddress), address],
            [select(getChainId), chainId],
            [
              call(postDeploy, { signature, address, chainId }),
              Promise.resolve(),
            ],
          ])
          .put(signContentSuccess(signature))
          .dispatch(signContentRequest('cid'))
          .run({ silenceTimeout: true })
      })

      describe('when the post deploy fails', () => {
        it('should dispatch an action signaling the failure of the action', () => {
          return expectSaga(signatureSaga)
            .provide([
              [select(getAddress), address],
              [select(getChainId), chainId],
              [
                call(postDeploy, { signature, address, chainId }),
                Promise.reject(new Error(error)),
              ],
            ])
            .put(signContentFailure(error))
            .dispatch(signContentRequest('cid'))
            .run({ silenceTimeout: true })
        })
      })
    })
  })

  describe('when handling the create identity request', () => {
    describe('when the request fails', () => {
      beforeEach(() => {
        mockedGetConnectedProvider.mockRejectedValue(new Error(error))
      })

      it('should dispatch an action signaling the failure of the action', () => {
        return expectSaga(signatureSaga)
          .put(createIdentityFailure(error))
          .dispatch(createIdentityRequest())
          .run({ silenceTimeout: true })
      })
    })

    describe('when the request succeeds', () => {
      const mockedCreateIdentity = createIdentity as jest.MockedFunction<
        typeof createIdentity
      >
      const identity = {} as AuthIdentity

      beforeEach(() => {
        mockedGetConnectedProvider.mockResolvedValue(mockedProvider)
        mockedCreateIdentity.mockResolvedValue(identity)
      })

      it('should dispatch an action signaling the success of the action, another signaling the fetch catalyst request, and should try to close the server', () => {
        return expectSaga(signatureSaga)
          .provide([
            [select(getAddress), address],
            [select(getChainId), chainId],
            [
              call(closeServer, true, {
                responseType: 'identity',
                payload: { identity, address, chainId },
              }),
              Promise.resolve(),
            ],
          ])
          .put(createIdentitySuccess(identity))
          .put(fetchCatalystRequest())
          .dispatch(createIdentityRequest())
          .run({ silenceTimeout: true })
      })

      describe('when the close server request fails', () => {
        it('should dispatch an action signaling the failure of the action', () => {
          return expectSaga(signatureSaga)
            .provide([
              [select(getAddress), address],
              [select(getChainId), chainId],
              [
                call(closeServer, true, {
                  responseType: 'identity',
                  payload: { identity, address, chainId },
                }),
                Promise.reject(new Error(error)),
              ],
            ])
            .put(createIdentityFailure(error))
            .dispatch(createIdentityRequest())
            .run({ silenceTimeout: true })
        })
      })
    })
  })

  describe('when handling the sign world ACL request', () => {
    describe('when the request fails', () => {
      beforeEach(() => {
        mockedGetConnectedProvider.mockRejectedValue(new Error(error))
      })

      it('should dispatch an action signaling the failure of the action', () => {
        return expectSaga(signatureSaga)
          .put(signWorldACLFailure(error))
          .dispatch(signWorldACLRequest('payload'))
          .run({ silenceTimeout: true })
      })
    })

    describe('when the request succeeds', () => {
      beforeEach(() => {
        mockedGetConnectedProvider.mockResolvedValue(mockedProvider)
      })

      it('should dispatch an action signaling the success of the action and the update world ACL request', () => {
        return expectSaga(signatureSaga)
          .put(signWorldACLSuccess(signature))
          .put(updateWorldACLRequest(signature))
          .dispatch(signWorldACLRequest('payload'))
          .run({ silenceTimeout: true })
      })
    })
  })
})
