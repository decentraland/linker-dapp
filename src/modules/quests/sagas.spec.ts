import { expectSaga } from 'redux-saga-test-plan'
import { questsSaga } from './sagas'
import { call, select } from 'redux-saga/effects'
import { sendSignedFetch, getQuestsInfoRequest } from './utils'
import {
  fetchQuestsInfoFailure,
  fetchQuestsInfoRequest,
  fetchQuestsInfoSuccess,
  signQuestsFetchFailure,
  signQuestsFetchRequest,
  signQuestsFetchSuccess,
} from './action'
import { QuestInfoResponse } from './types'
import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { AuthLinkType } from '@dcl/crypto'

describe('quests saga', () => {
  const error = 'error'

  describe('when handling the fetch info request', () => {
    describe('when the request fails', () => {
      it('should dispatch an action signaling the failure of the action', () => {
        return expectSaga(questsSaga)
          .provide([
            [call(getQuestsInfoRequest), Promise.reject(new Error(error))],
          ])
          .put(fetchQuestsInfoFailure(error))
          .dispatch(fetchQuestsInfoRequest())
          .run({ silenceTimeout: true })
      })
    })

    describe('when the request succeds', () => {
      const info = {} as QuestInfoResponse
      it('should dispatch an action signaling the success of the action', () => {
        return expectSaga(questsSaga)
          .provide([[call(getQuestsInfoRequest), info]])
          .put(fetchQuestsInfoSuccess(info))
          .dispatch(fetchQuestsInfoRequest())
          .run({ silenceTimeout: true })
      })
    })
  })

  describe('when handling the sign payload request', () => {
    describe('when the request fails', () => {
      it('should dispatch an action signaling the failure of the action', () => {
        const authChain = [
          {
            type: AuthLinkType.ECDSA_PERSONAL_EPHEMERAL,
            payload: 'abcd',
            signature: 'signedMessage',
          },
        ]
        return expectSaga(questsSaga)
          .provide([
            [select(getAddress), '0xA'],
            [
              call(sendSignedFetch, { address: '0xA', authChain }),
              Promise.reject(new Error(error)),
            ],
          ])
          .put(signQuestsFetchFailure(error))
          .dispatch(signQuestsFetchRequest(authChain))
          .run({ silenceTimeout: true })
      })
    })

    describe('when the request succeeds', () => {
      it('should dispatch an action signaling the success of the action', () => {
        const authChain = [
          {
            type: AuthLinkType.ECDSA_PERSONAL_EPHEMERAL,
            payload: 'abcd',
            signature: 'signedMessage',
          },
        ]
        return expectSaga(questsSaga)
          .provide([
            [select(getAddress), '0xA'],
            [call(sendSignedFetch, { address: '0xA', authChain }), null],
          ])
          .put(signQuestsFetchSuccess())
          .dispatch(signQuestsFetchRequest(authChain))
          .run({ silenceTimeout: true })
      })
    })
  })
})
