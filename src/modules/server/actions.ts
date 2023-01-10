import { action } from 'typesafe-actions'
import { CatalystResponse, FileSize } from './reducer'
import { InfoResponse } from './types'

export const FETCH_FILES_REQUEST = '[Request] Fetch Files'
export const FETCH_FILES_SUCCESS = '[Success] Fetch Files'
export const FETCH_FILES_FAILURE = '[Failure] Fetch Files'

export const FETCH_INFO_REQUEST = '[Request] Fetch info'
export const FETCH_INFO_SUCCESS = '[Success] Fetch info'
export const FETCH_INFO_FAILURE = '[Failure] Fetch info'

export const FETCH_CATALYST_REQUEST = '[Request] Fetch catalyst'
export const FETCH_CATALYST_SUCCESS = '[Success] Fetch catalyst'
export const FETCH_CATALYST_FAILURE = '[Failure] Fetch catalyst'

export const fetchFilesRequest = () => action(FETCH_FILES_REQUEST)
export const fetchFilesSuccess = (files: FileSize[]) =>
  action(FETCH_FILES_SUCCESS, { files })
export const fetchFilesFailure = (error: string) =>
  action(FETCH_FILES_FAILURE, { error })

export const fetchInfoRequest = () => action(FETCH_INFO_REQUEST)
export const fetchInfoSuccess = (info: InfoResponse) =>
  action(FETCH_INFO_SUCCESS, { info })
export const fetchInfoFailure = (error: string) =>
  action(FETCH_INFO_FAILURE, { error })

export const fetchCatalystRequest = () => action(FETCH_CATALYST_REQUEST)
export const fetchCatalystSuccess = (payload: CatalystResponse) =>
  action(FETCH_CATALYST_SUCCESS, payload)
export const fetchCatalystFailure = (error: string) =>
  action(FETCH_CATALYST_FAILURE, { error })

export type FetchFilesRequestAction = ReturnType<typeof fetchFilesRequest>
export type FetchFilesSuccessAction = ReturnType<typeof fetchFilesSuccess>
export type FetchFilesFailureAction = ReturnType<typeof fetchFilesFailure>

export type FetchInfoRequestAction = ReturnType<typeof fetchInfoRequest>
export type FetchInfoSuccessAction = ReturnType<typeof fetchInfoSuccess>
export type FetchInfoFailureAction = ReturnType<typeof fetchInfoFailure>

export type FetchCatalystRequest = ReturnType<typeof fetchCatalystRequest>
export type FetchCatalystSuccess = ReturnType<typeof fetchCatalystSuccess>
export type FetchCatalystFailure = ReturnType<typeof fetchCatalystFailure>
