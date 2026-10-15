import { ChainId } from '@dcl/schemas'
import { DeployState } from './types'
import {
  CANCEL_FORBIDDEN_MESSAGE,
  CANCEL_WHILE_UNDEPLOYING_MESSAGE,
  DeployScene,
  deleteDeploy,
  getDeployStateRequest,
  parseDeployState,
  postDeploy,
  subscribeToDeployState,
} from './utils'

describe('server utils', () => {
  let fetchMock: jest.SpyInstance
  let deployState: DeployState

  beforeEach(() => {
    fetchMock = jest.spyOn(globalThis, 'fetch')
    deployState = {
      phase: 'uploading',
      upload: null,
      result: null,
      error: null,
    }
  })

  afterEach(() => {
    fetchMock.mockRestore()
  })

  const respondWith = (status: number, body: unknown) =>
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify(body), { status })
    )

  const respondWithRaw = (status: number, body: string) =>
    fetchMock.mockResolvedValueOnce(new Response(body, { status }))

  // Response whose body can be cancelled, to check that it gets released
  const respondWithStream = (status: number, cancelBody: jest.Mock) =>
    fetchMock.mockResolvedValueOnce({
      status,
      ok: status >= 200 && status < 300,
      body: { cancel: cancelBody },
    } as unknown as Response)

  describe('when posting the signed deployment', () => {
    let payload: DeployScene

    beforeEach(() => {
      payload = {
        address: '0xaddress',
        authChain: [],
        chainId: ChainId.ETHEREUM_SEPOLIA,
      }
    })

    describe('and the CLI starts it in the background', () => {
      beforeEach(() => {
        respondWith(202, deployState)
      })

      it('should resolve with the deployment state', () => {
        return expect(postDeploy(payload)).resolves.toEqual(deployState)
      })

      describe('and the request is sent', () => {
        beforeEach(async () => {
          await postDeploy(payload)
        })

        it('should ask the CLI to respond asynchronously', () => {
          expect(fetchMock).toHaveBeenCalledWith(
            '/api/deploy',
            expect.objectContaining({
              method: 'post',
              headers: expect.objectContaining({ Prefer: 'respond-async' }),
            })
          )
        })
      })
    })

    describe('and the CLI starts it in the background answering with a body that is not JSON', () => {
      beforeEach(() => {
        respondWithRaw(202, 'Accepted')
      })

      it('should reject with an unexpected state error', () => {
        return expect(postDeploy(payload)).rejects.toThrow(
          'Unexpected deployment state received from the CLI'
        )
      })
    })

    describe('and the deployment was already started', () => {
      beforeEach(() => {
        respondWith(409, deployState)
      })

      it('should resolve with the deployment state', () => {
        return expect(postDeploy(payload)).resolves.toEqual(deployState)
      })
    })

    describe('and the deployment was already started answering with a body that is not JSON', () => {
      beforeEach(() => {
        respondWithRaw(409, 'Conflict')
      })

      it('should reject with an unexpected state error', () => {
        return expect(postDeploy(payload)).rejects.toThrow(
          'Unexpected deployment state received from the CLI'
        )
      })
    })

    describe('and an older CLI answers once the deployment succeeded', () => {
      let cancelBody: jest.Mock

      beforeEach(() => {
        cancelBody = jest.fn().mockResolvedValue(undefined)
        respondWithStream(200, cancelBody)
      })

      it('should resolve with undefined', () => {
        return expect(postDeploy(payload)).resolves.toBeUndefined()
      })

      describe('and the response is handled', () => {
        beforeEach(async () => {
          await postDeploy(payload)
        })

        it('should release the unread response body', () => {
          expect(cancelBody).toHaveBeenCalled()
        })
      })
    })

    describe('and an older CLI answers once the deployment failed', () => {
      beforeEach(() => {
        respondWith(400, { message: 'Deployment failed' })
      })

      it('should reject with the error message', () => {
        return expect(postDeploy(payload)).rejects.toThrow('Deployment failed')
      })
    })

    describe('and the CLI fails with a body that is not JSON', () => {
      beforeEach(() => {
        respondWithRaw(500, 'Internal Server Error')
      })

      it('should reject with an error including the status', () => {
        return expect(postDeploy(payload)).rejects.toThrow(
          'Could not deploy the scene (500)'
        )
      })
    })
  })

  describe('when getting the deployment state', () => {
    describe('and the CLI exposes it', () => {
      beforeEach(() => {
        respondWith(200, deployState)
      })

      it('should resolve with the deployment state', () => {
        return expect(getDeployStateRequest()).resolves.toEqual(deployState)
      })
    })

    describe('and the CLI does not expose it', () => {
      beforeEach(() => {
        respondWith(404, { message: 'Not found' })
      })

      it('should resolve with undefined', () => {
        return expect(getDeployStateRequest()).resolves.toBeUndefined()
      })
    })

    describe('and the CLI does not expose it with a response body to release', () => {
      let cancelBody: jest.Mock

      beforeEach(async () => {
        cancelBody = jest.fn().mockResolvedValue(undefined)
        respondWithStream(404, cancelBody)
        await getDeployStateRequest()
      })

      it('should release the unread response body', () => {
        expect(cancelBody).toHaveBeenCalled()
      })
    })

    describe('and the CLI fails to answer', () => {
      beforeEach(() => {
        respondWith(500, {})
      })

      it('should reject with an error', () => {
        return expect(getDeployStateRequest()).rejects.toThrow(
          'Could not get the deployment state (500)'
        )
      })
    })

    describe('and the CLI fails to answer with a response body to release', () => {
      let cancelBody: jest.Mock

      beforeEach(async () => {
        cancelBody = jest.fn().mockResolvedValue(undefined)
        respondWithStream(500, cancelBody)
        await getDeployStateRequest().catch(() => undefined)
      })

      it('should release the unread response body', () => {
        expect(cancelBody).toHaveBeenCalled()
      })
    })
  })

  describe('when cancelling the deployment', () => {
    let token: string

    beforeEach(() => {
      token = 'a-deploy-token'
    })

    describe('and the CLI accepts the cancellation', () => {
      beforeEach(() => {
        respondWith(202, deployState)
      })

      it('should resolve with the deployment state', () => {
        return expect(deleteDeploy(token)).resolves.toEqual(deployState)
      })

      describe('and the request is sent', () => {
        beforeEach(async () => {
          await deleteDeploy(token)
        })

        it('should send the deploy token', () => {
          expect(fetchMock).toHaveBeenCalledWith(
            '/api/deploy',
            expect.objectContaining({
              method: 'delete',
              headers: { 'X-Deploy-Token': token },
            })
          )
        })
      })
    })

    describe('and the deployment already ended', () => {
      beforeEach(() => {
        deployState = { ...deployState, phase: 'deployed' }
        respondWith(409, deployState)
      })

      it('should resolve with the final deployment state', () => {
        return expect(deleteDeploy(token)).resolves.toEqual(deployState)
      })
    })

    describe('and the CLI is removing the previous scenes', () => {
      beforeEach(() => {
        deployState = { ...deployState, phase: 'undeploying' }
        respondWith(409, deployState)
      })

      it('should reject explaining that it cannot cancel while removing the previous scenes', () => {
        return expect(deleteDeploy(token)).rejects.toThrow(
          CANCEL_WHILE_UNDEPLOYING_MESSAGE
        )
      })
    })

    describe('and the CLI rejects the deploy token', () => {
      beforeEach(() => {
        respondWith(403, { message: 'Invalid or missing deploy token' })
      })

      it('should reject telling to cancel it from the terminal', () => {
        return expect(deleteDeploy(token)).rejects.toThrow(
          CANCEL_FORBIDDEN_MESSAGE
        )
      })
    })

    describe('and the CLI does not support cancelling', () => {
      beforeEach(() => {
        respondWithRaw(404, 'Not Found')
      })

      it('should reject with an error', () => {
        return expect(deleteDeploy(token)).rejects.toThrow(
          'Could not cancel the deployment (404)'
        )
      })
    })
  })

  describe('when parsing a deployment state', () => {
    let value: unknown

    describe('and the phase is unknown', () => {
      beforeEach(() => {
        value = { ...deployState, phase: 'publishing' }
      })

      it('should return undefined', () => {
        expect(parseDeployState(value)).toBeUndefined()
      })
    })

    describe('and the value is not an object', () => {
      beforeEach(() => {
        value = 'uploading'
      })

      it('should return undefined', () => {
        expect(parseDeployState(value)).toBeUndefined()
      })
    })

    describe('and every field is well formed', () => {
      beforeEach(() => {
        value = {
          phase: 'deployed',
          upload: {
            stage: 'processing',
            sentBytes: 10,
            totalBytes: 10,
            completedBatches: 2,
            totalBatches: 2,
          },
          result: { entityId: 'bafy', message: 'Deployed' },
          error: null,
          cancelRequested: true,
        }
      })

      it('should return the same state', () => {
        expect(parseDeployState(value)).toEqual(value)
      })
    })

    describe('and the optional fields are malformed', () => {
      beforeEach(() => {
        value = {
          phase: 'failed',
          upload: { stage: 'uploading', sentBytes: '10', totalBytes: 100 },
          result: { entityId: 42 },
          error: { code: 'DEPLOY_FAILED' },
          cancelRequested: 'yes',
        }
      })

      it('should normalise them to null and drop the cancellation flag', () => {
        expect(parseDeployState(value)).toEqual({
          phase: 'failed',
          upload: null,
          result: null,
          error: null,
        })
      })
    })

    describe('and the upload has an unknown stage', () => {
      beforeEach(() => {
        value = {
          ...deployState,
          upload: {
            stage: 'compressing',
            sentBytes: 0,
            totalBytes: 10,
            completedBatches: null,
            totalBatches: null,
          },
        }
      })

      it('should normalise the upload to null', () => {
        expect(parseDeployState(value)).toEqual({ ...deployState, upload: null })
      })
    })

    describe('and the upload has malformed batch counts', () => {
      beforeEach(() => {
        value = {
          ...deployState,
          upload: {
            stage: 'uploading',
            sentBytes: 5,
            totalBytes: 10,
            completedBatches: '1',
          },
        }
      })

      it('should normalise the batch counts to null', () => {
        expect(parseDeployState(value)).toEqual({
          ...deployState,
          upload: {
            stage: 'uploading',
            sentBytes: 5,
            totalBytes: 10,
            completedBatches: null,
            totalBatches: null,
          },
        })
      })
    })

    describe('and the result message is not a string', () => {
      beforeEach(() => {
        value = { ...deployState, result: { entityId: 'bafy', message: 1 } }
      })

      it('should drop the message', () => {
        expect(parseDeployState(value)).toEqual({
          ...deployState,
          result: { entityId: 'bafy' },
        })
      })
    })
  })

  describe('when subscribing to the deployment state', () => {
    let onState: jest.Mock
    let onError: jest.Mock
    let unsubscribe: () => void

    beforeEach(() => {
      onState = jest.fn()
      onError = jest.fn()
    })

    describe('and the browser does not support server-sent events', () => {
      beforeEach(() => {
        unsubscribe = subscribeToDeployState(onState, onError)
      })

      it('should report an error', () => {
        expect(onError).toHaveBeenCalled()
      })

      it('should return a function that can be called', () => {
        expect(() => unsubscribe()).not.toThrow()
      })
    })

    describe('and the browser supports server-sent events', () => {
      class FakeEventSource {
        static instance: FakeEventSource
        listeners: Record<string, (event: { data: string }) => void> = {}
        onerror: (() => void) | null = null
        close = jest.fn()
        constructor(public url: string) {
          FakeEventSource.instance = this
        }
        addEventListener(
          type: string,
          listener: (event: { data: string }) => void
        ) {
          this.listeners[type] = listener
        }
        emitState(data: string) {
          this.listeners.state({ data })
        }
      }

      beforeEach(() => {
        ;(globalThis as { EventSource?: unknown }).EventSource = FakeEventSource
        unsubscribe = subscribeToDeployState(onState, onError)
      })

      afterEach(() => {
        delete (globalThis as { EventSource?: unknown }).EventSource
      })

      it('should open the stream on the deployment resource', () => {
        expect(FakeEventSource.instance.url).toBe('/api/deploy')
      })

      describe('and a non-final state is received', () => {
        beforeEach(() => {
          FakeEventSource.instance.emitState(JSON.stringify(deployState))
        })

        it('should report the state', () => {
          expect(onState).toHaveBeenCalledWith(deployState)
        })

        it('should keep the stream open', () => {
          expect(FakeEventSource.instance.close).not.toHaveBeenCalled()
        })
      })

      describe('and a final state is received', () => {
        beforeEach(() => {
          deployState = { ...deployState, phase: 'cancelled' }
          FakeEventSource.instance.emitState(JSON.stringify(deployState))
        })

        it('should report the state', () => {
          expect(onState).toHaveBeenCalledWith(deployState)
        })

        it('should close the stream', () => {
          expect(FakeEventSource.instance.close).toHaveBeenCalled()
        })
      })

      describe('and the received data is not JSON', () => {
        beforeEach(() => {
          FakeEventSource.instance.emitState('not json')
        })

        it('should report an error instead of a state', () => {
          expect([onError.mock.calls.length, onState.mock.calls.length]).toEqual(
            [1, 0]
          )
        })
      })

      describe('and the received state has an unknown phase', () => {
        beforeEach(() => {
          FakeEventSource.instance.emitState(
            JSON.stringify({ ...deployState, phase: 'publishing' })
          )
        })

        it('should report an error instead of a state', () => {
          expect([onError.mock.calls.length, onState.mock.calls.length]).toEqual(
            [1, 0]
          )
        })
      })

      describe('and the stream fails', () => {
        beforeEach(() => {
          FakeEventSource.instance.onerror?.()
        })

        it('should report an error', () => {
          expect(onError).toHaveBeenCalled()
        })
      })

      describe('and the subscription is closed', () => {
        beforeEach(() => {
          unsubscribe()
        })

        it('should close the stream', () => {
          expect(FakeEventSource.instance.close).toHaveBeenCalled()
        })
      })
    })
  })
})
