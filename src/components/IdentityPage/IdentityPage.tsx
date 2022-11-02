import { SyntheticEvent, useEffect, useState } from 'react'
import './style.css'
import { Header, Button, Navbar } from 'decentraland-ui'
import LoginModal from 'decentraland-dapps/dist/containers/LoginModal'
import { Props } from './types'
import RenderWalletData from '../RenderWalletData/RenderWalletData'
import { isTestnet } from '../../config'

export default function IdentityPage(props: Props) {
  const { isConnected, wallet, isConnecting, onConnectWallet, isSigning, onRequestIdentity } = props

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSignature = (e: SyntheticEvent) => {
    e.preventDefault()
    onRequestIdentity()
  }

  // Close modal once the wallet is connected
  useEffect(() => {
    if (isConnected && isModalOpen) {
      setIsModalOpen(false)
    }
  }, [isConnected, isModalOpen])

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
        onConnectWallet={() => setIsModalOpen(true)}
      />
      <form>
        <div>
          <Button primary onClick={handleSignature} disabled={!isConnected} loading={isSigning}>
            Sign ephemeral wallet
          </Button>
        </div>
      </form>
      <LoginModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConnect={onConnectWallet}
          isLoading={isConnecting}
        />
    </div>
  )
}
