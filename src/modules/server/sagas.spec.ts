import { expectSaga } from 'redux-saga-test-plan'
import { throwError } from 'redux-saga-test-plan/providers'
import { channel, Channel } from 'redux-saga'
import { call, cancel, fork, take } from 'redux-saga/effects'
import {
  fetchCatalystFailure,
  fetchCatalystRequest,
  fetchCatalystSuccess,
  fetchFilesFailure,
  fetchFilesRequest,
  fetchFilesSuccess,
  fetchInfoFailure,
  fetchInfoRequest,
  fetchInfoSuccess,
  cancelDeployRequest,
  cancelDeploySuccess,
  cancelDeployFailure,
  updateDeployState,
  deployOutcomeUnknown,
} from './actions'
import { CatalystResponse, FileSize } from './reducer'
import {
  apiSaga,
  createDeployStateChannel,
  DEPLOY_CONNECTION_LOST_MESSAGE,
  DEPLOY_STATE_UNAVAILABLE_MESSAGE,
  followDeploy,
} from './sagas'
import { getDeployToken } from './deployToken'
import { DeployState, InfoResponse } from './types'
import {
  deleteDeploy,
  getCatalystsPointer,
  getDeployStateRequest,
  getFilesRequest,
  getInfoRequest,
} from './utils'

describe('server sagas', () => {
  const error = 'error'

  describe('when handling the fetch files request', () => {
    describe('when the request fails', () => {
      it('should dispatch an action signaling the failure of the action', () => {
        return expectSaga(apiSaga)
          .provide([[call(getFilesRequest), Promise.reject(new Error(error))]])
          .put(fetchFilesFailure(error))
          .dispatch(fetchFilesRequest())
          .run({ silenceTimeout: true })
      })
    })

    describe('when the request succeeds', () => {
      const files: FileSize[] = []
      it('should dispatch an action signaling the success of the action', () => {
        return expectSaga(apiSaga)
          .provide([[call(getFilesRequest), files]])
          .put(fetchFilesSuccess(files))
          .dispatch(fetchFilesRequest())
          .run({ silenceTimeout: true })
      })
    })
  })

  describe('when handling the fetch info request', () => {
    describe('when the request fails', () => {
      it('should dispatch an action signaling the failure of the action', () => {
        return expectSaga(apiSaga)
          .provide([[call(getInfoRequest), Promise.reject(new Error(error))]])
          .put(fetchInfoFailure(error))
          .dispatch(fetchInfoRequest())
          .run({ silenceTimeout: true })
      })
    })

    describe('when the request succeeds', () => {
      const info = {} as InfoResponse
      it('should dispatch an action signaling the success of the action', () => {
        return expectSaga(apiSaga)
          .provide([[call(getInfoRequest), info]])
          .put(fetchInfoSuccess(info))
          .dispatch(fetchInfoRequest())
          .run({ silenceTimeout: true })
      })
    })
  })

  describe('when handling the fetch catalyst request', () => {
    describe('when the request fails', () => {
      it('should dispatch an action signaling the failure of the action', () => {
        return expectSaga(apiSaga)
          .provide([
            [call(getCatalystsPointer), Promise.reject(new Error(error))],
          ])
          .put(fetchCatalystFailure(error))
          .dispatch(fetchCatalystRequest())
          .run({ silenceTimeout: true })
      })
    })

    describe('when the request succeeds', () => {
      const catalyst = {} as CatalystResponse
      it('should dispatch an action signaling the success of the action', () => {
        return expectSaga(apiSaga)
          .provide([[call(getCatalystsPointer), catalyst]])
          .put(fetchCatalystSuccess(catalyst))
          .dispatch(fetchCatalystRequest())
          .run({ silenceTimeout: true })
      })
    })
  })

  describe('when handling the cancel deploy request', () => {
    let token: string | null

    describe('and the page has no deploy token', () => {
      beforeEach(() => {
        token = null
      })

      it('should dispatch an action signaling the failure without asking the CLI', () => {
        return expectSaga(apiSaga)
          .provide([
            [call(getDeployToken), token],
            {
              call(effect, next) {
                if (effect.fn === deleteDeploy) {
                  throw new Error('should not ask the CLI')
                }
                return next()
              },
            },
          ])
          .put(cancelDeployFailure("This page can't cancel the deployment"))
          .dispatch(cancelDeployRequest())
          .run({ silenceTimeout: true })
      })
    })

    describe('and the page has a deploy token', () => {
      beforeEach(() => {
        token = 'a-deploy-token'
      })

      describe('and the request fails', () => {
        it('should dispatch an action signaling the failure of the action', () => {
          return expectSaga(apiSaga)
            .provide([
              [call(getDeployToken), token],
              [call(deleteDeploy, token!), throwError(new Error(error))],
            ])
            .put(cancelDeployFailure(error))
            .dispatch(cancelDeployRequest())
            .run({ silenceTimeout: true })
        })
      })

      describe('and the request succeeds', () => {
        let state: DeployState

        beforeEach(() => {
          state = {
            phase: 'uploading',
            upload: null,
            result: null,
            error: null,
            cancelRequested: true,
          }
        })

        it('should store the returned deployment state and signal the success of the action', () => {
          return expectSaga(apiSaga)
            .provide([
              [call(getDeployToken), token],
              [call(deleteDeploy, token!), state],
            ])
            .put(updateDeployState(state))
            .put(cancelDeploySuccess())
            .dispatch(cancelDeployRequest())
            .run({ silenceTimeout: true })
        })
      })
    })
  })

  describe('when following a deployment', () => {
    let initialState: DeployState
    let uploadingState: DeployState
    let deployedState: DeployState

    beforeEach(() => {
      initialState = {
        phase: 'undeploying',
        upload: null,
        result: null,
        error: null,
      }
      uploadingState = {
        phase: 'uploading',
        upload: {
          stage: 'uploading',
          sentBytes: 50,
          totalBytes: 100,
          completedBatches: 1,
          totalBatches: 2,
        },
        result: null,
        error: null,
      }
      deployedState = {
        ...uploadingState,
        phase: 'deployed',
        result: { entityId: 'bafy', message: 'Deployed' },
      }
    })

    describe('and the initial state is already final', () => {
      it('should store the state and return it without following the deployment', () => {
        return expectSaga(followDeploy, deployedState)
          .provide({
            call(effect, next) {
              if (effect.fn === createDeployStateChannel) {
                throw new Error('should not follow the deployment')
              }
              return next()
            },
          })
          .put(updateDeployState(deployedState))
          .returns(deployedState)
          .run()
      })
    })

    describe('and the events stream reports the deployment until it ends', () => {
      let stateChannel: Channel<object>
      let closeSpy: jest.SpyInstance

      beforeEach(() => {
        stateChannel = channel()
        closeSpy = jest.spyOn(stateChannel, 'close')
        stateChannel.put({ state: uploadingState })
        stateChannel.put({ state: deployedState })
      })

      it('should store every state received and return the final one', () => {
        return expectSaga(followDeploy, initialState)
          .provide([[call(createDeployStateChannel), stateChannel]])
          .put(updateDeployState(initialState))
          .put(updateDeployState(uploadingState))
          .put(updateDeployState(deployedState))
          .returns(deployedState)
          .run()
      })

      describe('and the final state is received', () => {
        beforeEach(async () => {
          await expectSaga(followDeploy, initialState)
            .provide([[call(createDeployStateChannel), stateChannel]])
            .run()
        })

        it('should close the events stream', () => {
          expect(closeSpy).toHaveBeenCalled()
        })
      })
    })

    describe('and following is cancelled while the events stream is open', () => {
      let stateChannel: Channel<object>
      let closeSpy: jest.SpyInstance

      beforeEach(async () => {
        stateChannel = channel()
        closeSpy = jest.spyOn(stateChannel, 'close')
        stateChannel.put({ state: uploadingState })
        function* followAndStop() {
          const task: unknown = yield fork(followDeploy, initialState)
          yield take('STOP')
          yield cancel(task as never)
        }
        await expectSaga(followAndStop)
          .provide([[call(createDeployStateChannel), stateChannel]])
          .dispatch({ type: 'STOP' })
          .run()
      })

      it('should close the events stream', () => {
        expect(closeSpy).toHaveBeenCalled()
      })
    })

    describe('and the events stream fails', () => {
      let stateChannel: Channel<object>
      let polledStates: (DeployState | undefined | Error)[]
      let delays: number[]

      beforeEach(() => {
        stateChannel = channel()
        stateChannel.put({ error: true })
        delays = []
      })

      const runFollowDeploy = () =>
        expectSaga(followDeploy, initialState).provide([
          [call(createDeployStateChannel), stateChannel],
          {
            call(effect, next) {
              if (effect.fn === getDeployStateRequest) {
                const polled = polledStates.shift()
                if (polled instanceof Error) {
                  throw polled
                }
                return polled
              }
              if (typeof effect.args[0] === 'number') {
                delays.push(effect.args[0])
                return undefined
              }
              return next()
            },
          },
        ])

      describe('and polling the state reports the deployment until it ends', () => {
        beforeEach(() => {
          polledStates = [uploadingState, deployedState]
        })

        it('should poll the state, store every state received and return the final one', () => {
          return runFollowDeploy()
            .put(updateDeployState(uploadingState))
            .put(updateDeployState(deployedState))
            .returns(deployedState)
            .run()
        })
      })

      describe('and some polls fail before the deployment ends', () => {
        beforeEach(() => {
          polledStates = [
            new Error('Failed to fetch'),
            new Error('Failed to fetch'),
            uploadingState,
            new Error('Failed to fetch'),
            deployedState,
          ]
        })

        it('should retry the failed polls and return the final state', () => {
          return runFollowDeploy()
            .put(updateDeployState(uploadingState))
            .put(updateDeployState(deployedState))
            .not.put(deployOutcomeUnknown(DEPLOY_CONNECTION_LOST_MESSAGE))
            .returns(deployedState)
            .run()
        })

        describe('and the deployment is followed', () => {
          beforeEach(async () => {
            await runFollowDeploy().run()
          })

          it('should back off between consecutive failures and restart the backoff after a successful poll', () => {
            expect(delays).toEqual([1000, 2000, 1000, 1000])
          })
        })
      })

      describe('and every poll fails', () => {
        beforeEach(() => {
          polledStates = Array.from(
            { length: 10 },
            () => new Error('Failed to fetch'),
          )
        })

        it('should signal that the connection to the CLI was lost and return undefined', () => {
          return runFollowDeploy()
            .put(deployOutcomeUnknown(DEPLOY_CONNECTION_LOST_MESSAGE))
            .returns(undefined)
            .run()
        })

        describe('and the deployment is followed', () => {
          beforeEach(async () => {
            await runFollowDeploy().run()
          })

          it('should give up after five consecutive failures, backing off up to 8 seconds', () => {
            expect(delays).toEqual([1000, 2000, 4000, 8000])
          })
        })
      })

      describe('and the CLI does not expose the deployment state', () => {
        beforeEach(() => {
          polledStates = [undefined]
        })

        it('should clear the stored deployment state, signal that the outcome is unknown and return undefined', () => {
          return runFollowDeploy()
            .put(updateDeployState(null))
            .put(deployOutcomeUnknown(DEPLOY_STATE_UNAVAILABLE_MESSAGE))
            .returns(undefined)
            .run()
        })
      })
    })
  })
})
