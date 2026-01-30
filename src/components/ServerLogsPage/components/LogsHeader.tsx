import {
  Container,
  Header,
  HeaderMenu,
  Badge,
  Color,
  Address,
  Blockie,
  Button,
  Icon,
} from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { ChainId } from '@dcl/schemas'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { redirectToAuthDapp } from '../../../modules/wallet/utils'

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

const NetworkBadge = ({ isTestNet }: { isTestNet: boolean }) => (
  <div className="address-header">
    <Badge color={Color.SHADOWS}>
      {isTestNet ? t('global.network.sepolia') : t('global.network.mainnet')}
    </Badge>
  </div>
)

const WalletBadge = ({ address }: { address: string }) => (
  <div className="address-header">
    <Blockie scale={3} seed={address}>
      <Address tooltip strong value={address} />
    </Blockie>
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
  const isTestNet = wallet?.chainId !== ChainId.ETHEREUM_MAINNET

  const handleSignClick = () => {
    if (isConnected && rootCID) {
      onSignContent(rootCID)
    } else {
      redirectToAuthDapp()
    }
  }

  const buttonLabel = isConnected
    ? t('server_logs_page.header.sign_button')
    : t('global.connect_button')

  return (
    <Container>
      <HeaderMenu>
        <HeaderMenu.Left>
          <Container textAlign="center">
            <Header size="large">{t('server_logs_page.header.title')}</Header>
            <Header size="medium" className="description">
              {t('server_logs_page.header.description')}
            </Header>
          </Container>
        </HeaderMenu.Left>
      </HeaderMenu>

      <HeaderMenu>
        <HeaderMenu.Left>
          {world && <WorldBadge world={world} />}
          {isConnected && <NetworkBadge isTestNet={isTestNet} />}
          {wallet?.address && <WalletBadge address={wallet.address} />}
        </HeaderMenu.Left>

        {!signed && (
          <HeaderMenu.Right>
            <Button
              primary
              size="medium"
              loading={isConnecting || isSigning}
              onClick={handleSignClick}
            >
              {buttonLabel}
            </Button>
          </HeaderMenu.Right>
        )}
      </HeaderMenu>
    </Container>
  )
}
