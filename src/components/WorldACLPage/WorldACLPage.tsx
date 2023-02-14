import { useEffect, useState } from 'react'
import { getChainName } from '@dcl/schemas'
import {
  Navbar,
  Footer,
  Page,
  Header,
  Button,
  Container,
  HeaderMenu,
  Color,
  Badge,
  Address,
  Blockie,
  Loader,
  Table,
} from 'decentraland-ui'
import LoginModal from 'decentraland-dapps/dist/containers/LoginModal'
import { Props } from './types'

import './style.css'
import ACLStatus from './ACLStatus'

export default function WorldACLPage(props: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const {
    isConnected,
    wallet,
    isConnecting,
    isSigning,
    signed,
    info,
    onConnectWallet,
    onSignContent,
    onFetchInfo,
  } = props

  useEffect(() => {
    onFetchInfo()
  }, [onFetchInfo])

  // Close modal once the wallet is connected
  useEffect(() => {
    if (isConnected && isModalOpen) {
      setIsModalOpen(false)
    }
  }, [isConnected, isModalOpen])

  return (
    <div className="Page-story-container">
      <Navbar
        leftMenu={<></>}
        isConnected={isConnected}
        isConnecting={isConnecting}
        address={wallet?.address}
      />
      <Page>
        <Container>
          <HeaderMenu>
            <HeaderMenu.Left>
              <Container textAlign="center">
                <Header size="large">
                  Updating {info?.worldName || 'Untitled World'} ACL
                </Header>
              </Container>
            </HeaderMenu.Left>
          </HeaderMenu>
          <HeaderMenu>
            <HeaderMenu.Left>
              {!!isConnected && wallet?.chainId && (
                <div className="address-header">
                  <Badge color={Color.SHADOWS}>
                    {getChainName(wallet.chainId)}
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
                  loading={isConnecting || isSigning}
                  onClick={
                    isConnected
                      ? () => onSignContent(info!.payload)
                      : () => setIsModalOpen(true)
                  }
                >
                  {isConnected ? 'Sign & Deploy' : 'Connect Wallet'}
                </Button>
              </HeaderMenu.Right>
            )}
          </HeaderMenu>
        </Container>
        {!info && <Loader />}
        {info && signed && <ACLStatus info={info} />}
        {!signed && info && (
          <Container>
            <Table basic="very">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Address</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {info.allowed.length > 0 ? (
                  info.allowed.map((address, index) => (
                    <Table.Row key={index}>
                      <Table.Cell>{address}</Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell>
                      No additional addresses are allowed to deploy. Only the
                      world owner.
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </Container>
        )}
        <LoginModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConnect={onConnectWallet}
          isLoading={isConnecting}
        />
      </Page>
      <Footer />
    </div>
  )
}
