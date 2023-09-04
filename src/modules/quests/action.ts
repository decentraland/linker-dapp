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

export const SIGN_QUESTS_FETCH_REQUEST = '[Request] Sign Quest Request'
export const SIGN_QUESTS_FETCH_SUCCESS = '[Success] Sign Quest Request'
export const SIGN_QUESTS_FETCH_FAILURE = '[Failure] Sign Quest Request'

export const signQuestsFetchRequest = (signature: string) => action(SIGN_QUESTS_FETCH_REQUEST, { signature })
export const signQuestsFetchSuccess = () => action(SIGN_QUESTS_FETCH_SUCCESS)
export const signQuestsFetchFailure = (error: string) => action(SIGN_QUESTS_FETCH_FAILURE, { error })

export type SignQuestsFetchRequestAction = ReturnType<typeof signQuestsFetchRequest>
export type SignQuestsFetchSuccessAction = ReturnType<typeof signQuestsFetchSuccess>
export type SignQuestsFetchFailureAction = ReturnType<typeof signQuestsFetchFailure>