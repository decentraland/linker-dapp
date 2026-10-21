import { Button, Loader, Progress } from 'decentraland-ui'
import { isFinalDeployPhase } from '../../modules/server/utils'
import { Props } from './DeployProgress.types'
import { getDeployProgressView } from './utils'

import './styles.css'

export default function DeployProgress({
  state,
  canCancel,
  isCancelling,
  cancelError,
  onCancel,
}: Props) {
  const { label, percent, bytes, batches } = getDeployProgressView(state)
  const isFinal = isFinalDeployPhase(state.phase)
  const cancelRequested = isCancelling || !!state.cancelRequested

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
      {canCancel && (
        <Button
          secondary
          size="small"
          disabled={isFinal || cancelRequested}
          onClick={onCancel}
        >
          {cancelRequested && !isFinal ? 'Cancelling...' : 'Cancel'}
        </Button>
      )}
      {state.phase === 'cancelled' && state.error && (
        <p className="DeployProgress-error">{state.error.message}</p>
      )}
      {cancelError && <p className="DeployProgress-error">{cancelError}</p>}
    </div>
  )
}
