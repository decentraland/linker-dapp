import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { SignatureHeader } from '../../SignatureHeader'
import { LocationBadge } from '../../Badges'

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
  const badges = world ? <LocationBadge world={world} /> : null

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
