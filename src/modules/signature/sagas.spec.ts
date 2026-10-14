/**
 * @jest-environment node
 */
// https://github.com/jsdom/jsdom/issues/2524#issuecomment-902027138

import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import { createIdentity } from '@dcl/builder-client'
import { ChainId } from '@dcl/schemas'
import { Authenticator, AuthIdentity, AuthLinkType } from '@dcl/crypto'
import { Provider } from 'decentraland-connect'
import { getConnectedProvider } from 'decentraland-dapps/dist/lib/eth'
import {
  getAddress,
  getChainId,
} from 'decentraland-dapps/dist/modules/wallet/selectors'
import { expectSaga } from 'redux-saga-test-plan'
import { call, select } from 'redux-saga/effects'
import { putWorldACLRequest, deleteWorldACLRequest } from '../acl/actions'
import { closeServer, postDeploy } from '../server/utils'
import { deploySuccess, fetchCatalystRequest } from '../server/actions'
import { getDeleteScenesFromWorldPayload } from '../server/selectors'
import { followDeploy } from '../server/sagas'
import { DeployState } from '../server/types'
import {
  createIdentityFailure,
  createIdentityRequest,
  createIdentitySuccess,
  signContentFailure,
  signContentRequest,
  signContentSuccess,
  signPutWorldACLFailure,
  signPutWorldACLRequest,
  signPutWorldACLSuccess,
} from './actions'
import { signatureSaga } from './sagas'
import { getIdentity } from '../wallet/selectors'

jest.mock('@ethersproject/providers')
jest.mock('@dcl/builder-client')
jest.mock('decentraland-dapps/dist/lib/eth')
jest.mock('@dcl/crypto')

describe('signature sagas', () => {
  const error = 'error'
  const signature = 'signedMessage'
  const payload = 'payload'
  const auth = {} as AuthIdentity
  const authChain = [
    {
      type: AuthLinkType.ECDSA_PERSONAL_EPHEMERAL,
      payload: payload,
      signature: signature,
    },
  ]
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
        jest.spyOn(Authenticator, 'signPayload').mockImplementationOnce(() => {
          throw new Error(error)
        })
      })

      it('should dispatch an action signaling the failure of the action', () => {
        return expectSaga(signatureSaga)
          .provide([[select(getIdentity), auth]])
          .put(signContentFailure(error))
          .dispatch(signContentRequest('cid'))
          .run({ silenceTimeout: true })
      })
    })

    describe('when the request succeeds', () => {
      beforeEach(() => {
        jest.spyOn(Authenticator, 'signPayload').mockReturnValueOnce(authChain)
      })

      it('should dispatch an action signaling the success of the action and execute the postDeploy request', () => {
        return expectSaga(signatureSaga)
          .provide([
            [select(getIdentity), auth],
            [select(getAddress), address],
            [select(getChainId), chainId],
            [select(getDeleteScenesFromWorldPayload), undefined],
            [
              call(postDeploy, { authChain, address, chainId, deleteSignature: undefined }),
              Promise.resolve(),
            ],
          ])
          .put(signContentSuccess(authChain))
          .dispatch(signContentRequest('cid'))
          .run({ silenceTimeout: true })
      })

      describe('when the post deploy fails', () => {
        it('should dispatch an action signaling the failure of the action', () => {
          return expectSaga(signatureSaga)
            .provide([
              [select(getIdentity), auth],
              [select(getAddress), address],
              [select(getChainId), chainId],
              [select(getDeleteScenesFromWorldPayload), undefined],
              [
                call(postDeploy, { authChain, address, chainId, deleteSignature: undefined }),
                Promise.reject(new Error(error)),
              ],
            ])
            .put(signContentFailure(error))
            .put(signContentSuccess(authChain))
            .dispatch(signContentRequest('cid'))
            .run({ silenceTimeout: true })
        })
      })

      describe('and the CLI answers once the deployment has ended', () => {
        it('should dispatch an action signaling the success of the deployment', () => {
          return expectSaga(signatureSaga)
            .provide([
              [select(getIdentity), auth],
              [select(getAddress), address],
              [select(getChainId), chainId],
              [select(getDeleteScenesFromWorldPayload), undefined],
              [
                call(postDeploy, { authChain, address, chainId, deleteSignature: undefined }),
                undefined,
              ],
            ])
            .put(deploySuccess())
            .dispatch(signContentRequest('cid'))
            .run({ silenceTimeout: true })
        })
      })

      describe('and the CLI runs the deployment in the background', () => {
        let startedState: DeployState
        let finalState: DeployState | undefined

        beforeEach(() => {
          startedState = {
            phase: 'uploading',
            upload: null,
            result: null,
            error: null,
          }
        })

        const runSaga = () =>
          expectSaga(signatureSaga).provide([
            [select(getIdentity), auth],
            [select(getAddress), address],
            [select(getChainId), chainId],
            [select(getDeleteScenesFromWorldPayload), undefined],
            [
              call(postDeploy, { authChain, address, chainId, deleteSignature: undefined }),
              startedState,
            ],
            [call(followDeploy, startedState), finalState],
          ])

        describe('and the deployment ends deployed', () => {
          beforeEach(() => {
            finalState = {
              ...startedState,
              phase: 'deployed',
              result: { entityId: 'bafy' },
            }
          })

          it('should dispatch an action signaling the success of the deployment', () => {
            return runSaga()
              .put(deploySuccess())
              .dispatch(signContentRequest('cid'))
              .run({ silenceTimeout: true })
          })
        })

        describe('and the deployment fails', () => {
          beforeEach(() => {
            finalState = {
              ...startedState,
              phase: 'failed',
              error: { code: 'DEPLOY_FAILED', message: error },
            }
          })

          it('should dispatch an action signaling the failure with the deployment error message', () => {
            return runSaga()
              .put(signContentFailure(error))
              .dispatch(signContentRequest('cid'))
              .run({ silenceTimeout: true })
          })
        })

        describe('and the deployment is cancelled', () => {
          beforeEach(() => {
            finalState = { ...startedState, phase: 'cancelled' }
          })

          it('should not dispatch an action signaling the success of the deployment', () => {
            return runSaga()
              .not.put(deploySuccess())
              .dispatch(signContentRequest('cid'))
              .run({ silenceTimeout: true })
          })

          it('should not dispatch an action signaling a failure', () => {
            return runSaga()
              .not.put.like({ action: { type: signContentFailure(error).type } })
              .dispatch(signContentRequest('cid'))
              .run({ silenceTimeout: true })
          })
        })

        describe('and the deployment state is not available', () => {
          beforeEach(() => {
            finalState = undefined
          })

          it('should not dispatch an action signaling the success of the deployment', () => {
            return runSaga()
              .not.put(deploySuccess())
              .dispatch(signContentRequest('cid'))
              .run({ silenceTimeout: true })
          })
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

  describe('when handling the sign world ACL put request', () => {
    describe('when the request fails', () => {
      beforeEach(() => {
        jest.spyOn(Authenticator, 'signPayload').mockImplementationOnce(() => {
          throw new Error(error)
        })
      })

      it('should dispatch an action signaling the failure of the action', () => {
        return expectSaga(signatureSaga)
          .provide([[select(getIdentity), auth]])
          .put(signPutWorldACLFailure(error))
          .dispatch(signPutWorldACLRequest('payload'))
          .run({ silenceTimeout: true })
      })
    })

    describe('when the request succeeds', () => {
      beforeEach(() => {
        jest.spyOn(Authenticator, 'signPayload').mockReturnValueOnce(authChain)
      })

      it('should dispatch an action signaling the success of the action and the update world ACL request', () => {
        return expectSaga(signatureSaga)
          .provide([[select(getIdentity), auth]])
          .put(signPutWorldACLSuccess(authChain))
          .put(putWorldACLRequest(authChain))
          .dispatch(signPutWorldACLRequest('payload'))
          .run({ silenceTimeout: true })
      })
    })
  })
})
