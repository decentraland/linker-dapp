import {
  Container,
  Header,
  HeaderMenu,
  Badge,
  Color,
  Address,
  Blockie,
  Button,
} from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { ChainId } from '@dcl/schemas'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { redirectToAuthDapp } from '../../../modules/wallet/utils'
import { StorageType } from '../../../modules/server/types'

type StorageHeaderProps = {
  wallet: Partial<Wallet> | null
  isConnected: boolean
  isConnecting: boolean
  isSigning: boolean
  signed: boolean
  world?: string
  baseParcel: { x: number; y: number }
  storageType?: StorageType
  targetUrl?: string
  rootCID?: string
  onSignContent: (cid: string) => void
}

const LocationBadge = ({
  world,
  baseParcel,
}: Pick<StorageHeaderProps, 'world' | 'baseParcel'>) => (
  <div className="address-header">
    <Badge color={Color.SUMMER_RED}>
      {world || `${baseParcel.x}, ${baseParcel.y}`}
    </Badge>
  </div>
)

const StorageTypeBadge = ({
  storageType,
}: Pick<StorageHeaderProps, 'storageType'>) => (
  <div className="address-header">
    <Badge color={Color.BLUISH_STEEL}>
      {t(`storage_page.storage_types.${storageType}`)}
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

export const StorageHeader = ({
  wallet,
  isConnected,
  isConnecting,
  isSigning,
  signed,
  world,
  baseParcel,
  storageType,
  rootCID,
  onSignContent,
}: StorageHeaderProps) => {
  const isTestNet = wallet?.chainId !== ChainId.ETHEREUM_MAINNET

  const handleSignClick = () => {
    if (isConnected && rootCID) {
      onSignContent(rootCID)
    } else {
      redirectToAuthDapp()
    }
  }

  const buttonLabel = isConnected
    ? t('storage_page.header.sign_button')
    : t('global.connect_button')

  return (
    <Container>
      <HeaderMenu>
        <HeaderMenu.Left>
          <Container textAlign="center">
            <Header size="large">{t('storage_page.header.title')}</Header>
            <Header size="medium" className="description">
              {t('storage_page.header.description')}
            </Header>
          </Container>
        </HeaderMenu.Left>
      </HeaderMenu>

      <HeaderMenu>
        <HeaderMenu.Left>
          <LocationBadge world={world} baseParcel={baseParcel} />
          {storageType && <StorageTypeBadge storageType={storageType} />}
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
