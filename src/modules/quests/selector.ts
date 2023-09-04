import { RootState } from "../../types";

export const getState = (state: RootState) => state.quests

export const getQuestsInfo = (state: RootState) => getState(state).info