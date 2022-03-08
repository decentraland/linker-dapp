import { SyntheticEvent, useEffect } from 'react'
import './style.css'
import { Header, Button, Navbar } from 'decentraland-ui'
import { ChainId } from '@dcl/schemas'
import { getConfig, isDevelopment } from '../../config'
import Error from '../Error'
import { Props } from './types'
import LandInfo from '../LandInfo/LandInfo'
import RenderWalletData from '../RenderWalletData/RenderWalletData'

export default function LinkScenePage(props: Props) {
  const {
    isConnected,
    wallet,
    authorizations,
    isUpdateAuthorized,
    isConnecting,
    onConnectWallet,
    isSigning,
    base,
    error,
    isAuthorizationLoading,
    signed
  } = props

  const handleSignature = (e: SyntheticEvent) => {
    e.preventDefault()
    const { onSignContent } = props
    onSignContent(getConfig('rootCID'))
  }

  const wearableId = getConfig('wearableId')
  const { x, y } = getConfig('baseParcel')
  const rootCID = getConfig('rootCID')
  const isRopsten = wallet?.chainId === ChainId.ETHEREUM_ROPSTEN
  const networkName = isRopsten ? 'zone' : 'org'
  const deployUrl = `https://play.decentraland.${networkName}/?position=${x},${y}`

  useEffect(() => {
    if (wallet?.address) {
      fetch(`/api/address_info?address=${wallet.address}`)
        .then(() => console.log('address informed'))
        .catch(err => console.error(err))
    }
  }, [wallet?.address])

  return (
    <div className="LinkScenePage">
      {isRopsten && <div className="warning">Using Ropsten test network</div>}
      <Navbar />
      <Header>Update {wearableId ? 'Wearable' : 'LAND data'} </Header>
      <RenderWalletData
        authorizations={authorizations}
        isUpdateAuthorized={isUpdateAuthorized}
        isConnected={isConnected}
        isConnecting={isConnecting}
        wallet={wallet}
        onConnectWallet={onConnectWallet}
      />
      {!wearableId && (
        <>
          <div>
            <img
              style={{ maxWidth: '100%', maxHeight: '100%', width: '35%' }}
              className="map"
              src={`https://api.decentraland.${networkName}/v1/parcels/${x}/${y}/map.png`}
              alt={`Base parcel ${x},${y}`}
            />
          </div>
          <LandInfo deployUrl={deployUrl} base={base} />
          <p>
            Project CID: <b>{rootCID}</b>
          </p>
        </>
      )}
      {isConnected && signed && (
        <p>
          Content was succesfully signed and it's being uploaded{' '}
          <a href={deployUrl} target="_blank" rel="noreferrer">
            here
          </a>
          . You can close this page and check the CLI for more info.
        </p>
      )}
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
            loading={isSigning}
          >
            Sign and Deploy
          </Button>
        </div>
      </form>
      {error ? (
        isDevelopment() ? (
          <Error>{error}</Error>
        ) : (
          <Error>There was an unexpected error.</Error>
        )
      ) : null}
    </div>
  )
}
