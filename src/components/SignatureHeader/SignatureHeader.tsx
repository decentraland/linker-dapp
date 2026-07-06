import { Container, Header, HeaderMenu, Button } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Env } from '@dcl/ui-env'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { redirectToAuthDapp } from '../../modules/wallet/utils'
import { config } from '../../config'
import { NetworkBadge, WalletBadge } from '../Badges'

type SignatureHeaderProps = {
  titleKey: string
  descriptionKey: string
  signButtonKey: string
  badges: React.ReactNode
  wallet: Partial<Wallet> | null
  isConnected: boolean
  isConnecting: boolean
  isSigning: boolean
  signed: boolean
  rootCID?: string
  onSignContent: (cid: string) => void
}

export const SignatureHeader = ({
  titleKey,
  descriptionKey,
  signButtonKey,
  badges,
  wallet,
  isConnected,
  isConnecting,
  isSigning,
  signed,
  rootCID,
  onSignContent,
}: SignatureHeaderProps) => {
  const isTestNet = !config.is(Env.PRODUCTION)

  const handleSignClick = () => {
    if (isConnected && rootCID) {
      onSignContent(rootCID)
    } else {
      redirectToAuthDapp()
    }
  }

  const buttonLabel = isConnected
    ? t(signButtonKey)
    : t('global.connect_button')

  return (
    <Container>
      <HeaderMenu>
        <HeaderMenu.Left>
          <Container textAlign="center">
            <Header size="large">{t(titleKey)}</Header>
            <Header size="medium" className="description">
              {t(descriptionKey)}
            </Header>
          </Container>
        </HeaderMenu.Left>
      </HeaderMenu>

      <HeaderMenu>
        <HeaderMenu.Left>
          {badges}
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
