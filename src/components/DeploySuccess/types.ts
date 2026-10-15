import { CatalystResponse, Info } from '../../modules/server/reducer'
import { DeployState } from '../../modules/server/types'

export type Props = {
  catalysts?: CatalystResponse['catalysts']
  status?: CatalystResponse['status']
  info?: Info
  onFetchCatalyst: () => void
  deploySuccess?: boolean
  apiError?: string | null
  deployState?: DeployState | null
  deployOutcomeMessage?: string | null
  canCancel?: boolean
  isCancelling?: boolean
  cancelError?: string | null
  onCancel: () => void
}

export type MapStateProps = Pick<
  Props,
  | 'catalysts'
  | 'status'
  | 'info'
  | 'deploySuccess'
  | 'apiError'
  | 'deployState'
  | 'deployOutcomeMessage'
  | 'canCancel'
  | 'isCancelling'
  | 'cancelError'
>
export type MapDispatchProps = Pick<Props, 'onFetchCatalyst' | 'onCancel'>
