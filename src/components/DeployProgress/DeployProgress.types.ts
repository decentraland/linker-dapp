import { DeployState } from '../../modules/server/types'

export type Props = {
  state: DeployState
  canCancel: boolean
  isCancelling: boolean
  cancelError: string | null
  onCancel: () => void
}
