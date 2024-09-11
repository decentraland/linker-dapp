import { AuthLinkType } from '@dcl/crypto'
import {
  FETCH_QUESTS_INFO_REQUEST,
  FETCH_QUESTS_INFO_FAILURE,
  FETCH_QUESTS_INFO_SUCCESS,
  fetchQuestsInfoFailure,
  fetchQuestsInfoRequest,
  fetchQuestsInfoSuccess,
  signQuestsFetchRequest,
  SIGN_QUESTS_FETCH_REQUEST,
  SIGN_QUESTS_FETCH_SUCCESS,
  signQuestsFetchSuccess,
  signQuestsFetchFailure,
  SIGN_QUESTS_FETCH_FAILURE,
} from './action'
import { QuestInfoResponse } from './types'

describe('quests actions', () => {
  describe('when creating the action to signal the start of the fetch quests info request', () => {
    it('should return an object representing the action', () => {
      expect(fetchQuestsInfoRequest()).toEqual({
        type: FETCH_QUESTS_INFO_REQUEST,
      })
    })
  })

  describe('when creating the action to signal the success of the fetch quests info request', () => {
    const info: QuestInfoResponse = {
      messageToSign: 'post:/api/quests:1111:{}',
      extraData: {
        questName: 'Zombies World',
      },
      actionType: 'create',
    }
    it('should return an object representing the action', () => {
      expect(fetchQuestsInfoSuccess(info)).toEqual({
        type: FETCH_QUESTS_INFO_SUCCESS,
        payload: { info },
      })
    })
  })

  describe('when creating the action to signal the failure of the fetch quests info request', () => {
    it('should return an object representing the action', () => {
      expect(fetchQuestsInfoFailure('error')).toEqual({
        type: FETCH_QUESTS_INFO_FAILURE,
        payload: { error: 'error' },
      })
    })
  })

  describe('when creating the action to signal the start of the signed fetch request', () => {
    it('should return an object representing the action', () => {
      const authChain = [
        {
          type: AuthLinkType.ECDSA_PERSONAL_EPHEMERAL,
          payload: 'abcd',
          signature: 'signedMessage',
        },
      ]
      expect(signQuestsFetchRequest(authChain)).toEqual({
        type: SIGN_QUESTS_FETCH_REQUEST,
        payload: { authChain },
      })
    })
  })

  describe('when creating the action to signal the success of the signed fetch request', () => {
    it('should return an object representing the action', () => {
      expect(signQuestsFetchSuccess()).toEqual({
        type: SIGN_QUESTS_FETCH_SUCCESS,
      })
    })
  })

  describe('when creating the action to signal the failure of the signed fetch request', () => {
    it('should return an object representing the action', () => {
      expect(signQuestsFetchFailure('error')).toEqual({
        type: SIGN_QUESTS_FETCH_FAILURE,
        payload: { error: 'error' },
      })
    })
  })
})
