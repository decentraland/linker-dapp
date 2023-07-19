import { Badge, Color, Container, HeaderMenu, Table } from 'decentraland-ui'
import { Props } from './types'
import { useEffect } from 'react'

import './style.css'

export default function DeploySuccess({ onFetchCatalyst, catalysts = [], status, info, deploySuccess, apiError }: Props) {
  const entityIds = new Set(catalysts.map(c => c.entityId))
  const deployedToAll = (entityIds.size === 1) || (deploySuccess && info?.isWorld)

  useEffect(() => {
    if (deployedToAll || info?.isWorld || apiError) return
    const interval = setInterval(() => {
      onFetchCatalyst()
    }, 5_000)
    return () => clearInterval(interval)
  }, [onFetchCatalyst, deployedToAll, info, apiError])

  return (
    <Container>
      <HeaderMenu>
        <Badge color={deploySuccess ? '#20913e' : Color.SUNISH}>
          {deploySuccess ? 'Deployed successfully' : 'Deploying...'}
        </Badge>
      </HeaderMenu>
      { !info?.isWorld && <Table basic="very">
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
