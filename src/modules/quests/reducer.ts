import { LoadingState, loadingReducer } from "decentraland-dapps/dist/modules/loading/reducer"
import { QuestInfoResponse } from "./types"
import { CHANGE_QUEST_ACTION_TYPE, ChangeQuestActionTypeAction, CreateQuestFailureAction, CreateQuestRequestAction, CreateQuestSuccessAction, FETCH_QUESTS_INFO_FAILURE, FETCH_QUESTS_INFO_REQUEST, FETCH_QUESTS_INFO_SUCCESS, FetchQuestsInfoFailureAction, FetchQuestsInfoRequestAction, FetchQuestsInfoSuccessAction } from "./action"

export type QuestsState = {
	loading: LoadingState,
	error: string | null,
	info: QuestInfoResponse | undefined,
	actionType?: "create" | "list" | "activate" | "deactivate"
}


export const INITIAL_STATE: QuestsState = {
	info: undefined,
	loading: [],
	error: null,
	actionType: undefined,
}

export type ApiReducerAction = 
 	| FetchQuestsInfoRequestAction 
	| FetchQuestsInfoSuccessAction 
	| FetchQuestsInfoFailureAction
	| CreateQuestRequestAction
	| CreateQuestSuccessAction
	| CreateQuestFailureAction
	| ChangeQuestActionTypeAction

export const questsReducer = (state = INITIAL_STATE, action: ApiReducerAction): QuestsState => {
	switch (action.type) {
		case FETCH_QUESTS_INFO_REQUEST:
			return {
				...state,
				loading: loadingReducer(state.loading, action)
			}
		case FETCH_QUESTS_INFO_SUCCESS:
			return {
				...state,
				loading: loadingReducer(state.loading, action),
				info: action.payload.info,
				error: null
			}
		case FETCH_QUESTS_INFO_FAILURE: 
			return {
				...state,
				loading: loadingReducer(state.loading, action),
				error: action.payload.error,
				info: undefined
			}
		case CHANGE_QUEST_ACTION_TYPE:
			return {
				...state,
				actionType: action.payload.action
			}
		default:
			return state
	}
}