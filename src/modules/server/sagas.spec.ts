import { expectSaga } from 'redux-saga-test-plan'
import { channel, Channel } from 'redux-saga'
import { call, select } from 'redux-saga/effects'
import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'
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
} from './actions'
import { CatalystResponse, FileSize } from './reducer'
import {
  apiSaga,
  createDeployStateChannel,
  DEPLOY_STATE_POLLING_INTERVAL,
  followDeploy,
} from './sagas'
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
    describe('when the request fails', () => {
      it('should dispatch an action signaling the failure of the action', () => {
        return expectSaga(apiSaga)
          .provide([[call(deleteDeploy), Promise.reject(new Error(error))]])
          .put(cancelDeployFailure(error))
          .dispatch(cancelDeployRequest())
          .run({ silenceTimeout: true })
      })
    })

    describe('when the request succeeds', () => {
      let state: DeployState

      beforeEach(() => {
        state = { phase: 'uploading', upload: null, result: null, error: null }
      })

      it('should dispatch an action signaling the success of the action with the returned state', () => {
        return expectSaga(apiSaga)
          .provide([[call(deleteDeploy), state]])
          .put(cancelDeploySuccess(state))
          .dispatch(cancelDeployRequest())
          .run({ silenceTimeout: true })
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

      beforeEach(() => {
        stateChannel = channel()
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
    })

    describe('and the events stream fails', () => {
      let stateChannel: Channel<object>
      let polledStates: (DeployState | undefined)[]

      beforeEach(() => {
        stateChannel = channel()
        stateChannel.put({ error: true })
      })

      describe('and polling the state reports the deployment until it ends', () => {
        beforeEach(() => {
          polledStates = [uploadingState, deployedState]
        })

        it('should poll the state, store every state received and return the final one', () => {
          return expectSaga(followDeploy, initialState)
            .provide([
              [call(createDeployStateChannel), stateChannel],
              {
                call(effect, next) {
                  if (effect.fn === getDeployStateRequest) {
                    return polledStates.shift()
                  }
                  if (effect.args[0] === DEPLOY_STATE_POLLING_INTERVAL) {
                    return undefined
                  }
                  return next()
                },
              },
            ])
            .put(updateDeployState(uploadingState))
            .put(updateDeployState(deployedState))
            .returns(deployedState)
            .run()
        })
      })

      describe('and the CLI does not expose the deployment state', () => {
        beforeEach(() => {
          polledStates = [undefined]
        })

        it('should clear the stored deployment state and return undefined', () => {
          return expectSaga(followDeploy, initialState)
            .provide([
              [call(createDeployStateChannel), stateChannel],
              [call(getDeployStateRequest), polledStates[0]],
            ])
            .put(updateDeployState(null))
            .returns(undefined)
            .run()
        })
      })
    })
  })
})
