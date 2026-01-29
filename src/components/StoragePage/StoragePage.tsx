import { useEffect } from 'react'
import { Footer, Page, Loader } from 'decentraland-ui'
import { Navbar } from '../Navbar'
import { Props } from './types'
import { parseAction } from './utils'
import {
  StorageHeader,
  StorageCard,
  SuccessCard,
  ErrorToast,
} from './components'

import './style.css'

const StoragePage = ({
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

  const action = parseAction(info?.action)
  const baseParcel = info?.baseParcel ?? { x: 0, y: 0 }

  return (
    <div className="Page-story-container storage-page">
      <Navbar />
      <Page>
        <StorageHeader
          wallet={wallet}
          isConnected={isConnected}
          isConnecting={isConnecting}
          isSigning={isSigning}
          signed={signed}
          world={info?.world}
          baseParcel={baseParcel}
          storageType={info?.storageType}
          targetUrl={info?.targetUrl}
          rootCID={info?.rootCID}
          onSignContent={onSignContent}
        />

        <ErrorToast error={error ?? null} />

        {!info && <Loader />}

        {info && !signed && <StorageCard info={info} action={action} />}

        {signed && !error && (
          <SuccessCard action={action} storageType={info?.storageType} />
        )}
      </Page>
      <Footer />
    </div>
  )
}

export default StoragePage
