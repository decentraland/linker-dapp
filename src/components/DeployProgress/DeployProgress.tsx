import { Button, Loader, Progress } from 'decentraland-ui'
import { isFinalDeployPhase } from '../../modules/server/types'
import { Props } from './DeployProgress.types'
import { getDeployProgressView } from './utils'

import './styles.css'

export default function DeployProgress({
  state,
  isCancelling,
  cancelError,
  onCancel,
}: Props) {
  const { label, percent, bytes, batches } = getDeployProgressView(state)
  const isFinal = isFinalDeployPhase(state.phase)

  return (
    <div className="DeployProgress">
      <div className="DeployProgress-bar">
        {percent === undefined ? (
          <div className="DeployProgress-indeterminate">
            <Loader active inline size="small" />
            <span>{label}</span>
          </div>
        ) : (
          <Progress
            percent={percent}
            size="small"
            active={!isFinal}
            success={state.phase === 'deployed'}
            warning={state.phase === 'cancelled'}
            error={state.phase === 'failed'}
            label={label}
          />
        )}
        {(bytes || batches) && (
          <div className="DeployProgress-details">
            {bytes && <span>{bytes}</span>}
            {batches && <span>{batches}</span>}
          </div>
        )}
      </div>
      <Button
        secondary
        size="small"
        disabled={isFinal || isCancelling}
        loading={isCancelling}
        onClick={onCancel}
      >
        Cancel
      </Button>
      {cancelError && <p className="DeployProgress-error">{cancelError}</p>}
    </div>
  )
}
