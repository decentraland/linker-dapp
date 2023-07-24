import { BaseSyntheticEvent, useEffect, useState } from 'react'
import { ChainId } from '@dcl/schemas'
import { Header, Button, Navbar } from 'decentraland-ui'
import LoginModal from 'decentraland-dapps/dist/containers/LoginModal'
import RenderWalletData from '../RenderWalletData/RenderWalletData'
import { Props } from './types'
import './style.css'

export default function IdentityPage(props: Props) {
  const { isConnected, wallet, isConnecting, onConnectWallet, isSigning, onRequestIdentity } = props

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSignature = (e: BaseSyntheticEvent) => {
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
      {wallet.chainId === ChainId.ETHEREUM_GOERLI && <div className="warning">Using Goerli test network</div>}
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
          name='Login'
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConnect={onConnectWallet}
          isLoading={isConnecting}
        />
    </div>
  )
}
