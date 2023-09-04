import { loadingReducer } from "decentraland-dapps/dist/modules/loading/reducer"
import { FETCH_QUESTS_INFO_SUCCESS, fetchQuestsInfoFailure, fetchQuestsInfoRequest, fetchQuestsInfoSuccess} from "./action"
import { INITIAL_STATE, questsReducer } from "./reducer"
import { QuestInfoResponse } from "./types"

const error = "error"

const requestActions = [
  fetchQuestsInfoRequest(),
]

const failureActions = [
  { request: fetchQuestsInfoRequest(), failure: fetchQuestsInfoFailure(error) },
]

describe('quests reducer', () => {
  requestActions.forEach((action) => {
    describe(`when reducing the "${action.type}" action`, () => {
      it('should return a state with loading set', () => {
        const initialState = {
          ...INITIAL_STATE,
          loading: []
        }

        expect(questsReducer(initialState, action)).toEqual({
          ...initialState, 
          loading: loadingReducer(initialState.loading, action)
        })
      })
    })
  })

  failureActions.forEach((action) => {
    describe(`when reducing the "${action.failure.type} action"`, () => {
      it('should return a state with error set and the loading state cleared', () => {
        const initialState = {
          ...INITIAL_STATE,
          error: null,
          loading: loadingReducer([], action.request)
        }

        expect(questsReducer(initialState, action.failure)).toEqual({
          ...INITIAL_STATE,
          error,
          loading: []
        })
      })
    })
  })

  describe(`when recuing the ${FETCH_QUESTS_INFO_SUCCESS} action`, () => {
    const initialState = {
      ...INITIAL_STATE,
      loading: loadingReducer([], fetchQuestsInfoRequest())
    }

    const info: QuestInfoResponse = {
      messageToSign: "post:/api/quests:{}",
      extraData: {
        questName: "Z World"
      },
      actionType: "create"
    }

    it("should add info to the store", () => {
      expect(questsReducer(initialState, fetchQuestsInfoSuccess(info))).toEqual({
        ...initialState,
        loading: [],
        info
      })
    })
  })
})