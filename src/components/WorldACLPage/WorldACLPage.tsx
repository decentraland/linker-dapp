import React, { useEffect, useMemo, useState } from 'react'
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
} from 'decentraland-ui'
import LoginModal from 'decentraland-dapps/dist/containers/LoginModal'
import { Chip } from '../Chip'
import { Props } from './types'
import ACLStatus from './ACLStatus'
import './style.css'

function Allowed(props: {
  className: string
  description: string
  addresses: string[]
}) {
  const { className, description, addresses } = props
  return (
    <div className={className}>
      <span className="description">{description}</span>
      <div className="addresses">
        {addresses.map((address) => (
          <Chip text={address} type="square" />
        ))}
      </div>
    </div>
  )
}

export default function WorldACLPage(props: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPayloadExpired, setIsPayloadExpired] = useState(false)

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

  const allowedDifference = useMemo(() => {
    if (!info) return []

    const { allowed, oldAllowed } = info

    return allowed.length > oldAllowed.length
      ? allowed.filter((address) => !oldAllowed.includes(address))
      : oldAllowed.filter((address) => !allowed.includes(address))
  }, [info])

  useEffect(() => {
    onFetchInfo()
  }, [onFetchInfo])

  // Close modal once the wallet is connected
  useEffect(() => {
    if (isConnected && isModalOpen) {
      setIsModalOpen(false)
    }
  }, [isConnected, isModalOpen])

  useEffect(() => {
    if (!info) return

    const interval = setInterval(() => {
      setIsPayloadExpired(true)
    }, info.expiration * 1000)

    return () => {
      clearTimeout(interval)
    }
  }, [info])

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
              {!isConnected && (
                <Button
                  primary
                  size="medium"
                  loading={isConnecting}
                  onClick={() => setIsModalOpen(true)}
                >
                  Connect Wallet
                </Button>
              )}
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
          </HeaderMenu>
        </Container>
        {!info && <Loader />}
        {info && signed && <ACLStatus info={info} />}
        {isConnected && !signed && info && !info.allowed?.length && (
          <p>
            After this change, only you will be able to deploy scenes into the
            world.
          </p>
        )}
        {isConnected &&
          wallet.address &&
          !signed &&
          info &&
          info.allowed.length > 0 && (
            <>
              <p>
                You are about to{' '}
                <span>
                  <strong>
                    {info.allowed.length > info.oldAllowed.length
                      ? 'grant'
                      : 'revoke'}
                  </strong>
                </span>{' '}
                the permissions to deploy to your world to the following{' '}
                {allowedDifference.length > 1 ? 'addresses' : ' address'}:{' '}
                <ul>
                  {allowedDifference.map((address) => (
                    <li>
                      <Chip text={address} type="square" />
                    </li>
                  ))}
                </ul>
              </p>
              <div className="allowed">
                <h3>Access control list</h3>
                <Allowed
                  className="owner"
                  description="Owner"
                  addresses={[wallet.address]}
                />
                <Allowed
                  className="deployers"
                  description="Deployers"
                  addresses={info.allowed}
                />
              </div>
            </>
          )}
        {isConnected && !signed && info && (
          <Container className="sign-submit-container">
            <div>
              <Button
                primary
                size="medium"
                loading={isSigning}
                disabled={isPayloadExpired}
                onClick={() => onSignContent(info!.payload)}
              >
                Sign & Submit
              </Button>
              {isPayloadExpired ? (
                <p className="expired-message">The payload has expired</p>
              ) : null}
            </div>
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
