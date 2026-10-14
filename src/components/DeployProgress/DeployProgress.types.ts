import { DeployState } from '../../modules/server/types'

export type Props = {
  state: DeployState
  isCancelling: boolean
  cancelError: string | null
  onCancel: () => void
}
