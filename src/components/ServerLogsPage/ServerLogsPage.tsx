import { useEffect } from 'react'
import { Loader } from 'decentraland-ui'
import { PageLayout } from '../PageLayout'
import { ErrorToast } from '../ErrorToast'
import { Props } from './types'
import { LogsHeader, LogsCard, SuccessCard } from './components'

import './style.css'

const ServerLogsPage = ({
  isConnected,
  wallet,
  isConnecting,
  onSignContent,
  onFetchInfo,
  isSigning,
  signed,
  info,
  error,
}: Props) => {
  useEffect(() => {
    onFetchInfo()
  }, [onFetchInfo])

  return (
    <PageLayout className="serverlogs-page">
      <LogsHeader
        wallet={wallet}
        isConnected={isConnected}
        isConnecting={isConnecting}
        isSigning={isSigning}
        signed={signed}
        world={info?.world}
        targetUrl={info?.targetUrl}
        rootCID={info?.rootCID}
        onSignContent={onSignContent}
      />

      <ErrorToast error={error ?? null} />

      {!info && <Loader />}

      {info && !signed && <LogsCard info={info} />}

      {signed && !error && <SuccessCard />}
    </PageLayout>
  )
}

export default ServerLogsPage
