import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { RootState } from '../../types'
import { CANCEL_DEPLOY_REQUEST } from './actions'

export const getFiles = (state: RootState) => state.api.files
export const isLoading = (state: RootState) => !!state.api.loading.length
export const getError = (state: RootState) => state.api.error
export const getInfo = (state: RootState) => state.api.info
export const getDeleteScenesFromWorldPayload = (state: RootState) => state.api.info?.deleteScenesFromWorldPayload
export const getDeployState = (state: RootState) => state.api.deployState
export const isCancellingDeploy = (state: RootState) =>
  isLoadingType(state.api.loading, CANCEL_DEPLOY_REQUEST)
export const getCancelDeployError = (state: RootState) =>
  state.api.cancelDeployError
