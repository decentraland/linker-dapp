import { useEffect } from 'react'
import { Badge, Color, Container, HeaderMenu } from 'decentraland-ui'
import { ACLStatus as Status, Props } from './types'

import './style.css'

export default function ACLStatus({ aclStatus, info, onFetchWorldACL }: Props) {
  const aclUpdated = aclStatus === Status.UPDATED

  useEffect(() => {
    if (aclUpdated || !info) return
    const interval = setInterval(() => {
      onFetchWorldACL(info.targetContent, info.worldName)
    }, 5_000)
    return () => clearInterval(interval)
  }, [aclUpdated, info, onFetchWorldACL])

  return (
    <Container>
      <HeaderMenu>
        <Badge color={aclUpdated ? '#20913e' : Color.SUNISH}>
          {aclUpdated
            ? `World ACL updated successfully to ${info?.targetContent}`
            : 'Updating ACL..'}
        </Badge>
      </HeaderMenu>
    </Container>
  )
}
