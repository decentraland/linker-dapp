import { Badge, Color, Icon } from 'decentraland-ui'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { SignatureHeader } from '../../SignatureHeader'

type LogsHeaderProps = {
  wallet: Partial<Wallet> | null
  isConnected: boolean
  isConnecting: boolean
  isSigning: boolean
  signed: boolean
  world?: string
  targetUrl?: string
  rootCID?: string
  onSignContent: (cid: string) => void
}

const WorldBadge = ({ world }: { world: string }) => (
  <div className="address-header">
    <Badge color={Color.SUMMER_RED}>
      <Icon name="globe" /> {world}
    </Badge>
  </div>
)

export const LogsHeader = ({
  wallet,
  isConnected,
  isConnecting,
  isSigning,
  signed,
  world,
  rootCID,
  onSignContent,
}: LogsHeaderProps) => {
  const badges = world ? <WorldBadge world={world} /> : null

  return (
    <SignatureHeader
      titleKey="server_logs_page.header.title"
      descriptionKey="server_logs_page.header.description"
      signButtonKey="server_logs_page.header.sign_button"
      badges={badges}
      wallet={wallet}
      isConnected={isConnected}
      isConnecting={isConnecting}
      isSigning={isSigning}
      signed={signed}
      rootCID={rootCID}
      onSignContent={onSignContent}
    />
  )
}
