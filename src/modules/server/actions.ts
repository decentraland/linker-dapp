import { action } from 'typesafe-actions'
import { FileSize } from './reducer'

export const FETCH_FILES_REQUEST = '[Request] Fetch Files'
export const FETCH_FILES_SUCCESS = '[Success] Fetch Files'
export const FETCH_FILES_FAILURE = '[Failure] Fetch Files'

export const fetchFilesRequest = () => action(FETCH_FILES_REQUEST)

export const fetchFilesSuccess = (files: FileSize[]) =>
  action(FETCH_FILES_SUCCESS, { files })

export const fetchFilesFailure = (error: string) =>
  action(FETCH_FILES_FAILURE, { error })

export type FetchFilesRequestAction = ReturnType<typeof fetchFilesRequest>
export type FetchFilesSuccessAction = ReturnType<typeof fetchFilesSuccess>
export type FetchFilesFailureAction = ReturnType<typeof fetchFilesFailure>
