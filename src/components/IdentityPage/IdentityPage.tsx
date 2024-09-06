import { BaseSyntheticEvent } from 'react'
import { ChainId } from '@dcl/schemas'
import { Header, Button } from 'decentraland-ui'
import RenderWalletData from '../RenderWalletData/RenderWalletData'
import { Navbar } from '../Navbar'
import { Props } from './types'
import './style.css'

export default function IdentityPage(props: Props) {
  const { isConnected, wallet, isConnecting, isSigning, onRequestIdentity } =
    props

  const handleSignature = (e: BaseSyntheticEvent) => {
    e.preventDefault()
    onRequestIdentity()
  }

  return wallet ? (
    <div className="LinkScenePage">
      {wallet.chainId === ChainId.ETHEREUM_SEPOLIA && (
        <div className="warning">Using Sepolia test network</div>
      )}
      <Navbar />
      <Header>Create an identity to sign deployments </Header>
      <RenderWalletData
        isUpdateAuthorized={true}
        isConnected={isConnected}
        isConnecting={isConnecting}
        wallet={wallet}
      />
      <form>
        <div>
          <Button
            primary
            onClick={handleSignature}
            disabled={!isConnected}
            loading={isSigning}
          >
            Sign ephemeral wallet
          </Button>
        </div>
      </form>
    </div>
  ) : null
}
