import { action } from "typesafe-actions"
import { QuestInfoResponse } from "./types"

export const FETCH_QUESTS_INFO_REQUEST = '[Request] Fetch Quests info'
export const FETCH_QUESTS_INFO_SUCCESS = '[Success] Fetch Quests info'
export const FETCH_QUESTS_INFO_FAILURE = '[Failure] Fetch Quests info'

export const fetchQuestsInfoRequest = () => action(FETCH_QUESTS_INFO_REQUEST)
export const fetchQuestsInfoSuccess = (info: QuestInfoResponse) => action(FETCH_QUESTS_INFO_SUCCESS, { info })
export const fetchQuestsInfoFailure = (error: string) => action(FETCH_QUESTS_INFO_FAILURE, { error })

export type FetchQuestsInfoRequestAction = ReturnType<typeof fetchQuestsInfoRequest>
export type FetchQuestsInfoSuccessAction = ReturnType<typeof fetchQuestsInfoSuccess>
export type FetchQuestsInfoFailureAction = ReturnType<typeof fetchQuestsInfoFailure>

export const CREATE_QUEST_REQUEST = '[Request] Create Quest'
export const CREATE_QUEST_SUCCESS = '[Success] Create Quest'
export const CREATE_QUEST_FAILURE = '[Failure] Create Quest'

export const createQuestRequest = (signature: string) => action(CREATE_QUEST_REQUEST, { signature })
export const createQuestSuccess = (id: string) => action(CREATE_QUEST_SUCCESS, { id })
export const createQuestFailure = (error: string) => action(CREATE_QUEST_FAILURE, { error })

export type CreateQuestRequestAction = ReturnType<typeof createQuestRequest>
export type CreateQuestSuccessAction = ReturnType<typeof createQuestSuccess>
export type CreateQuestFailureAction = ReturnType<typeof createQuestFailure>


export const CHANGE_QUEST_ACTION_TYPE = "[Quests] Change ActionType"

export const changeQuestActionType = (newAction: "create" | "list" | "activate" | "deactivate") => action(CHANGE_QUEST_ACTION_TYPE, { action: newAction })

export type ChangeQuestActionTypeAction = ReturnType<typeof changeQuestActionType>