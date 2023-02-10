import { createSelector } from 'reselect'
import { RootState } from '../../types'

// TODO: we are using the same selectors we have in the signature module.

export const getState = (state: RootState) => state.signature
export const getData = createSelector(getState, (state) => state.data)
export const isLoading = createSelector(
  getState,
  (state) => state.loading.length > 0
)
export const getError = createSelector(getState, (state) => state.error)
