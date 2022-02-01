import React from 'react'
import { Address, Blockie, Header, Button, Navbar } from 'decentraland-ui'
import { ChainId } from '@dcl/schemas'
import { getConfig, isDevelopment } from '../../config'
import { coordsToString } from '../../modules/land/utils'
import Error from '../Error'
import { Props } from './types'

export default function LinkScenePage(props: Props) {
  const handleSignature = (e: any) => {
    e.preventDefault()
    const { onSignContent } = props
    onSignContent(getConfig('rootCID'))
  }

  function getLANDname() {
    const { base } = props
    return base.name ? `"${base.name}"` : `LAND without name`
  }

  function getFormattedUnauthorized() {
    const { authorizations } = props
    return authorizations
      .filter(a => !a.isUpdateAuthorized)
      .map(a => `"${coordsToString(a)}"`)
      .join(', ')
  }

  function renderWalletData() {
    const {
      isConnected,
      wallet,
      authorizations,
      isUpdateAuthorized,
      isConnecting,
      onConnectWallet
    } = props
    if (isConnected && wallet.address) {
      return (
        <React.Fragment>
          <p>
            Using address: &nbsp;
            <Blockie scale={3} seed={wallet.address}>
              <Address tooltip strong value={wallet.address} />
            </Blockie>
          </p>
          {authorizations.length && !isUpdateAuthorized ? (
            <Error>
              {`You don't have permissions to update The following LANDs that are part of the scene: ${getFormattedUnauthorized()}`}
            </Error>
          ) : null}
        </React.Fragment>
      )
    }

    return (
      <React.Fragment>
        {isConnecting ? null : <p>Could not find any wallet</p>}
        <p>
          <Button
            primary
            onClick={onConnectWallet}
            loading={isConnecting}
            disabled={isConnecting}
          >
            Reconnect&nbsp;
          </Button>
        </p>
      </React.Fragment>
    )
  }

  function renderLANDinfo() {
    const { error, isLandLoading, isConnected } = props
    const { x, y } = getConfig('baseParcel')

    if (error || !isConnected || isLandLoading) {
      return
    }

    return (
      <p>
        Updating <b>{getLANDname()}</b>{' '}
        <a href={deployUrl} target="_blank">
          at coordinates {x}, {y}
        </a>
      </p>
    )
  }

  const {
    error,
    isConnected,
    isUpdateAuthorized,
    isAuthorizationLoading,
    signed,
    wallet
  } = props
  const { x, y } = getConfig('baseParcel')
  const rootCID = getConfig('rootCID')
  const isRopsten = wallet?.chainId === ChainId.ETHEREUM_ROPSTEN
  const networkName = isRopsten ? 'zone' : 'org'
  const deployUrl = `https://play.decentraland.${networkName}/?position=${x},${y}`

  return (
    <div className="LinkScenePage">
      <Navbar />
      <Header>Update LAND data</Header>
      {renderWalletData()}
      <div>
        <img
          style={{ maxWidth: '100%', maxHeight: '100%', width: '45%' }}
          className="map"
          src={`https://api.decentraland.${networkName}/v1/parcels/${x}/${y}/map.png`}
          alt={`Base parcel ${x},${y}`}
        />
      </div>
      {renderLANDinfo()}
      <p>
        Project CID: <b>{rootCID}</b>
      </p>
      <form>
        <div>
          <Button
            primary
            onClick={handleSignature}
            disabled={
              !isConnected ||
              !!error ||
              isAuthorizationLoading ||
              !isUpdateAuthorized
            }
          >
            Sign and Deploy
          </Button>
        </div>
      </form>
      {isConnected && signed && (
        <p>
          Content was succesfully signed and it's being uploaded{' '}
          <a href={deployUrl} target="_blank">
            here
          </a>
          . You can close this page and check the CLI for more info.
        </p>
      )}
      {error ? (
        isDevelopment() ? (
          <Error>{error}</Error>
        ) : (
          <Error>There was an unexpected error.</Error>
        )
      ) : null}
      <style>{`
          .LinkScenePage {
            text-align: center;
          }
          .map {
            padding: 15px;
          }
          .options div input {
            color: white;
          }
        `}</style>
      {isRopsten ? (
        <style>{`
            body:before {
              content: 'Using Ropsten test network';
              background: var(--primary);
              color: white;
              text-align: center;
              text-transform: uppercase;
              height: 24px;
              width: 100%;
              position: fixed;
              padding-top: 2px;
            }
            .LinkScenePage {
              padding-top: 24px;
            }
          `}</style>
      ) : null}
    </div>
  )
}
