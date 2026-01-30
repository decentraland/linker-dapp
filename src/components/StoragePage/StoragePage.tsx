import { useEffect } from 'react'
import { Loader } from 'decentraland-ui'
import { PageLayout } from '../PageLayout'
import { ErrorToast } from '../ErrorToast'
import { Props } from './types'
import { parseAction } from './utils'
import { StorageHeader, StorageCard, SuccessCard } from './components'

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
    <PageLayout className="storage-page">
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
    </PageLayout>
  )
}

export default StoragePage
