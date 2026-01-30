import { useSignaturePage } from '../../hooks'
import { signStorageRequest } from '../../modules/signature/actions'
import StoragePage from './StoragePage'

const StoragePageContainer = () => {
  const {
    wallet,
    isConnected,
    isConnecting,
    signed,
    isSigning,
    info,
    error,
    handleSignContent,
    handleFetchInfo,
  } = useSignaturePage(signStorageRequest)

  return (
    <StoragePage
      wallet={wallet}
      isConnected={isConnected}
      isConnecting={isConnecting}
      signed={signed}
      isSigning={isSigning}
      info={info}
      error={error}
      onSignContent={handleSignContent}
      onFetchInfo={handleFetchInfo}
    />
  )
}

export default StoragePageContainer
