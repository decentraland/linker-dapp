import { takeEvery, call, put, select } from "redux-saga/effects";
import { CREATE_QUEST_REQUEST, CreateQuestRequestAction, FETCH_QUESTS_INFO_REQUEST, createQuestFailure, createQuestSuccess, fetchQuestsInfoFailure, fetchQuestsInfoSuccess } from "./action";
import { createQuest, getQuestsInfoRequest } from "./utils";
import { QuestInfoResponse } from "./types";
import { getAddress } from "decentraland-dapps/dist/modules/wallet/selectors";

export function* questsSaga() {
	yield takeEvery(FETCH_QUESTS_INFO_REQUEST, handleFetchQuestsInfoRequest)
	yield takeEvery(CREATE_QUEST_REQUEST, handleCreateQuest)
}

function* handleFetchQuestsInfoRequest() {
	try {
		const questsInfo: QuestInfoResponse = yield call(getQuestsInfoRequest)
		yield put(fetchQuestsInfoSuccess(questsInfo))
	} catch (e) {
		yield put(fetchQuestsInfoFailure((e as any).message))
	}
}

function* handleCreateQuest(action: CreateQuestRequestAction) {
	const { signature } = action.payload

	try {
		const address: string = yield select(getAddress)
		const response: { id: string } = yield call(createQuest, { address, signature })
		console.log("> Creation Quest ID: ", response)
		yield put(createQuestSuccess(response.id))
	} catch (error) {
		yield put(createQuestFailure((error as any).message))
	}
}