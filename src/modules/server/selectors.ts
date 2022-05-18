import { RootState } from '../../types'

export const getFiles = (state: RootState) => state.api.files
export const isLoading = (state: RootState) => !!state.api.loading.length
export const getError = (state: RootState) => state.api.error
