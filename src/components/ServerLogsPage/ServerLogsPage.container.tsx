import { useSignaturePage } from '../../hooks'
import { signLogsRequest } from '../../modules/signature/actions'
import ServerLogsPage from './ServerLogsPage'

const ServerLogsPageContainer = () => {
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
  } = useSignaturePage(signLogsRequest)

  return (
    <ServerLogsPage
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

export default ServerLogsPageContainer
