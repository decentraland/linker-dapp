import { ChainId } from '@dcl/schemas'
import { DeployState } from './types'
import {
  DeployScene,
  deleteDeploy,
  getDeployStateRequest,
  postDeploy,
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

    describe('and the deployment was already started', () => {
      beforeEach(() => {
        respondWith(409, deployState)
      })

      it('should resolve with the deployment state', () => {
        return expect(postDeploy(payload)).resolves.toEqual(deployState)
      })
    })

    describe('and an older CLI answers once the deployment succeeded', () => {
      beforeEach(() => {
        respondWith(200, {})
      })

      it('should resolve with undefined', () => {
        return expect(postDeploy(payload)).resolves.toBeUndefined()
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
  })

  describe('when cancelling the deployment', () => {
    describe('and the CLI accepts the cancellation', () => {
      beforeEach(() => {
        respondWith(202, deployState)
      })

      it('should resolve with the deployment state', () => {
        return expect(deleteDeploy()).resolves.toEqual(deployState)
      })
    })

    describe('and the deployment already ended', () => {
      beforeEach(() => {
        deployState = { ...deployState, phase: 'deployed' }
        respondWith(409, deployState)
      })

      it('should resolve with the final deployment state', () => {
        return expect(deleteDeploy()).resolves.toEqual(deployState)
      })
    })

    describe('and the CLI does not support cancelling', () => {
      beforeEach(() => {
        respondWith(404, {})
      })

      it('should reject with an error', () => {
        return expect(deleteDeploy()).rejects.toThrow(
          'Could not cancel the deployment (404)'
        )
      })
    })
  })
})
