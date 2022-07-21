import { SyntheticEvent } from 'react'
import './style.css'
import { Header, Button, Navbar } from 'decentraland-ui'
import { Props } from './types'
import RenderWalletData from '../RenderWalletData/RenderWalletData'
import { isTestnet } from '../../config'

export default function IdentityPage(props: Props) {
  const {
    isConnected,
    wallet,
    isConnecting,
    onConnectWallet,
    isSigning,
    onRequestIdentity
  } = props

  const handleSignature = (e: SyntheticEvent) => {
    e.preventDefault()
    onRequestIdentity()
  }

  return (
    <div className="LinkScenePage">
      {isTestnet() && <div className="warning">Using Goerli test network</div>}
      <Navbar />
      <Header>Create an identity to sign deployments </Header>
      <RenderWalletData
        isUpdateAuthorized={true}
        isConnected={isConnected}
        isConnecting={isConnecting}
        wallet={wallet}
        onConnectWallet={onConnectWallet}
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
  )
}
