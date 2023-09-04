import { takeEvery, call, put, select } from "redux-saga/effects";
import { SIGN_QUESTS_FETCH_REQUEST, SignQuestsFetchRequestAction, signQuestsFetchFailure, signQuestsFetchSuccess, fetchQuestsInfoFailure, fetchQuestsInfoSuccess, FETCH_QUESTS_INFO_REQUEST } from "./action";
import { sendSignedFetch, getQuestsInfoRequest } from "./utils";
import { QuestInfoResponse } from "./types";
import { getAddress } from "decentraland-dapps/dist/modules/wallet/selectors";

export function* questsSaga() {
	yield takeEvery(FETCH_QUESTS_INFO_REQUEST, handleFetchQuestsInfoRequest)
	yield takeEvery(SIGN_QUESTS_FETCH_REQUEST, handleCreateQuest)
}

function* handleFetchQuestsInfoRequest() {
	try {
		const questsInfo: QuestInfoResponse = yield call(getQuestsInfoRequest)
		yield put(fetchQuestsInfoSuccess(questsInfo))
	} catch (e) {
		yield put(fetchQuestsInfoFailure((e as any).message))
	}
}

function* handleCreateQuest(action: SignQuestsFetchRequestAction) {
	const { signature } = action.payload

	try {
		const address: string = yield select(getAddress)
		yield call(sendSignedFetch, { address, signature })
		yield put(signQuestsFetchSuccess())
	} catch (error) {
		yield put(signQuestsFetchFailure((error as any).message))
	}
}