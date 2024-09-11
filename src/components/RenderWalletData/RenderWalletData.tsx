import { Blockie, Address, Button } from 'decentraland-ui'
import { coordsToString } from '../../modules/land/utils'
import { redirectToAuthDapp } from '../../modules/wallet/utils'
import Error from '../Error'
import { Props } from './types'

export default function RenderWalletData({
  isConnected,
  isConnecting,
  wallet,
  authorizations,
  isUpdateAuthorized
}: Props) {
  function getFormattedUnauthorized() {
    return (authorizations || [])
      .filter(a => !a.isUpdateAuthorized)
      .map(a => `"${coordsToString(a)}"`)
      .join(', ')
  }

  if (isConnected && wallet.address) {
    return (
      <>
        <p>
          Using address: &nbsp;
          <Blockie scale={3} seed={wallet.address}>
            <Address tooltip strong value={wallet.address} />
          </Blockie>
        </p>
        {authorizations?.length && !isUpdateAuthorized ? (
          <Error>
            {`You don't have permissions to update The following LANDs that are part of the scene: ${getFormattedUnauthorized()}`}
          </Error>
        ) : null}
      </>
    )
  }

  return (
    <>
      {isConnecting ? null : <p>Could not find any wallet</p>}
      <p>
        <Button primary onClick={redirectToAuthDapp} loading={isConnecting} disabled={isConnecting}>
          Reconnect&nbsp;
        </Button>
      </p>
    </>
  )
}
