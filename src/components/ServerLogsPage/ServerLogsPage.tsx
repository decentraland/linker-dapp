import { useEffect } from 'react'
import { Footer, Page, Loader } from 'decentraland-ui'
import { Navbar } from '../Navbar'
import { Props } from './types'
import { LogsHeader, LogsCard, SuccessCard, ErrorToast } from './components'

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
    <div className="Page-story-container serverlogs-page">
      <Navbar />
      <Page>
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
      </Page>
      <Footer />
    </div>
  )
}

export default ServerLogsPage
