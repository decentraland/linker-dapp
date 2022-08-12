import { action } from 'typesafe-actions'
import { LANDMeta } from './types'

export const FETCH_LAND_REQUEST = '[Request] Fetch LAND'
export const FETCH_LAND_SUCCESS = '[Success] Fetch LAND'
export const FETCH_LAND_FAILURE = '[Failure] Fetch LAND'

export const fetchLandRequest = () => action(FETCH_LAND_REQUEST)
export const fetchLandSuccess = (land: LANDMeta) => action(FETCH_LAND_SUCCESS, { land })
export const fetchLandFailure = (error: string) => action(FETCH_LAND_FAILURE, { error })

export type FetchLandRequestAction = ReturnType<typeof fetchLandRequest>
export type FetchLandSuccessAction = ReturnType<typeof fetchLandSuccess>
export type FetchLandFailureAction = ReturnType<typeof fetchLandFailure>
