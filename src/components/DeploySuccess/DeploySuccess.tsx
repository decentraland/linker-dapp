import { useEffect } from 'react'
import { Badge, Color, Container, HeaderMenu, Table, Icon } from 'decentraland-ui'

import { DeployWarning } from '../DeployWarning';
import { DeployProgress } from '../DeployProgress'

import { Props } from './types'

import './style.css'

export default function DeploySuccess({
  onFetchCatalyst,
  catalysts = [],
  status,
  info,
  deploySuccess,
  apiError,
  deployState,
  deployOutcomeMessage = null,
  canCancel = false,
  isCancelling = false,
  cancelError = null,
  onCancel,
}: Props) {
  const entityIds = new Set(catalysts.map(c => c.entityId))
  const deployedToAll = (entityIds.size === 1) || (deploySuccess && info?.isWorld)
  const isCancelled = deployState?.phase === 'cancelled'
  const resultMessage = deploySuccess ? deployState?.result?.message : undefined

  useEffect(() => {
    if (deployedToAll || info?.isWorld || apiError || isCancelled) return
    const interval = setInterval(() => {
      onFetchCatalyst()
    }, 5_000)
    return () => clearInterval(interval)
  }, [onFetchCatalyst, deployedToAll, info, apiError, isCancelled])

  return (
    <Container className="DeploySuccess">
      <HeaderMenu>
        {isCancelled ? (
          <Badge color={Color.BLUISH_STEEL}>Deployment cancelled</Badge>
        ) : deployOutcomeMessage && !deploySuccess ? (
          <Badge color={Color.BLUISH_STEEL}>Deployment status unknown</Badge>
        ) : (
          <Badge color={deploySuccess ? '#20913e' : Color.SUNISH}>
            {deploySuccess ? 'Deployed successfully' : 'Deploying...'}
          </Badge>
        )}
      </HeaderMenu>
      {deployOutcomeMessage && !deploySuccess && (
        <p className="DeploySuccess-message">{deployOutcomeMessage}</p>
      )}
      {deployState && !deployOutcomeMessage && (
        <DeployProgress
          state={deployState}
          canCancel={canCancel}
          isCancelling={isCancelling}
          cancelError={cancelError}
          onCancel={onCancel}
        />
      )}
      {resultMessage && <p className="DeploySuccess-message">{resultMessage}</p>}
      {!isCancelled && <DeployWarning variant="outlined" />}
      { !info?.isWorld && !isCancelled && <Table basic="very">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Catalyst Server</Table.HeaderCell>
            <Table.HeaderCell>Time</Table.HeaderCell>
            <Table.HeaderCell>Entity Id</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {(catalysts || []).map(({ url, timestamp, entityId }) => (
            <Table.Row key={url}>
              <Table.Cell>{url}</Table.Cell>
              <Table.Cell>{new Date(timestamp).toLocaleString()}</Table.Cell>
              <Table.Cell>{entityId}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      }
    </Container>
  )
}
