import { useEffect, useState } from 'react'
import {
  Tabs,
  Footer,
  Page,
  Header,
  Icon,
  Button,
  Container,
  HeaderMenu,
  Color,
  Badge,
  Address,
  Blockie,
  Toast,
  ToastType,
  Loader,
  Modal,
} from 'decentraland-ui'
import { ChainId } from '@dcl/schemas'
import { redirectToAuthDapp } from '../../modules/wallet/utils'
import { Navbar } from '../Navbar'
import Files from '../Files'
import Map from '../Map'
import { LocationBadge } from '../Badges'
import { DeployWarning } from '../DeployWarning'
import DeploySuccess from '../DeploySuccess/DeploySuccess.container'
import { Props } from './types'

import './style.css'

enum Tab {
  Map = 'Map',
  Files = 'Files',
}

export default function LinkScenePage(props: Props) {
  const [tab, setTab] = useState<Tab>(Tab.Map)
  const [open, setOpen] = useState(true)
  const {
    isConnected,
    wallet,
    authorizations,
    isUpdateAuthorized,
    isConnecting,
    onSignContent,
    onFetchFiles,
    onFetchInfo,
    isSigning,
    isAuthorizationLoading,
    signed,
    info,
    deployError,
  } = props

  const { x, y } = info?.baseParcel || { x: 0, y: 0 }
  const isTestNet = wallet?.chainId !== ChainId.ETHEREUM_MAINNET
  const networkName = isTestNet && `&NETWORK=sepolia`
  const networkDomain = isTestNet ? 'zone' : 'org'
  const realm = info?.world ? `&realm=${info.world}` : ''
  const deployUrl = `https://play.decentraland.${networkDomain}/?position=${x},${y}${networkName}${realm}`

  useEffect(() => {
    onFetchInfo()
    onFetchFiles()
  }, [onFetchFiles, onFetchInfo])

  return (
    <div className="Page-story-container">
      <Modal open={open}>
        <div className="warning-modal">
          <h2>Warning</h2>
          <DeployWarning />
          <Button primary size="medium" onClick={() => setOpen(false)}>
            CONTINUE
          </Button>
        </div>
      </Modal>
      <Navbar />
      <Page>
        <Container>
          <HeaderMenu>
            <HeaderMenu.Left>
              <Container textAlign="center">
                <Header size="large">
                  Deploying {info?.title || 'Untitled Scene'}
                </Header>
                {info?.description && (
                  <Header size="medium">
                    {info?.description || 'Some description'}
                  </Header>
                )}
              </Container>
            </HeaderMenu.Left>
          </HeaderMenu>
          <HeaderMenu>
            <HeaderMenu.Left>
              <div
                className="address-header url"
                onClick={() =>
                  deployUrl && window.open(deployUrl!, '_blank')?.focus()
                }
              >
                {info?.world && <LocationBadge world={info.world} />}
                <LocationBadge baseParcel={{ x, y }} />
              </div>
              {!!isConnected && (
                <div className="address-header">
                  <Badge color={Color.SHADOWS}>
                    {isTestNet ? 'Sepolia' : 'Mainnet'}
                  </Badge>
                </div>
              )}
              <div className="address-header">
                {!!wallet?.address && (
                  <Blockie scale={3} seed={wallet.address}>
                    <Address tooltip strong value={wallet.address} />
                  </Blockie>
                )}
              </div>
            </HeaderMenu.Left>
            {!signed && (
              <HeaderMenu.Right>
                <Button
                  primary
                  size="medium"
                  loading={
                    isConnecting ||
                    isSigning ||
                    (isConnected && isAuthorizationLoading)
                  }
                  disabled={isConnected && !isUpdateAuthorized}
                  onClick={
                    isConnected
                      ? () => onSignContent(info!.rootCID)
                      : redirectToAuthDapp
                  }
                >
                  {isConnected ? 'Sign & Deploy' : 'Connect Wallet'}
                </Button>
              </HeaderMenu.Right>
            )}
          </HeaderMenu>
        </Container>
        {!!(authorizations?.length && !isUpdateAuthorized) && (
          <Toast
            type={ToastType.ERROR}
            title={
              info?.isWorld
                ? 'Check World permissions'
                : 'Check LAND permissions'
            }
            body="You dont have permissions to update some of the coords"
          />
        )}
        {info?.isPortableExperience && info?.isWorld && (
          <Toast
            type={ToastType.WARN}
            title="Scene override"
            body="Deploying a Portable Experience might override your current Scene"
          />
        )}
        {deployError && (
          <div className="toast-full-with">
            <Toast
              type={ToastType.ERROR}
              title="Failed to deploy scene"
              body={deployError ?? 'Look at the terminal for more info'}
            />
          </div>
        )}
        {!signed && (
          <Tabs isFullscreen>
            {Object.values(Tab).map((t) => (
              <Tabs.Tab key={t} onClick={() => setTab(t)} active={tab === t}>
                {t}
              </Tabs.Tab>
            ))}
          </Tabs>
        )}
        {!info && <Loader />}
        {signed && !deployError && <DeploySuccess />}
        {!signed && tab === Tab.Files && <Files />}
        {!signed && info && tab === Tab.Map && (
          <Map
            authorizations={authorizations}
            parcels={info!.parcels}
            baseParcel={info!.baseParcel}
          />
        )}
      </Page>
      <Footer />
    </div>
  )
}
