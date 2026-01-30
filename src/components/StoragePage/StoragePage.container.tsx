import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  getData as getWallet,
  isConnected,
  isConnecting,
} from 'decentraland-dapps/dist/modules/wallet/selectors'

import {
  getData as getSignature,
  isLoading as isSigningTx,
} from '../../modules/signature/selectors'
import { signStorageRequest } from '../../modules/signature/actions'
import { fetchInfoRequest } from '../../modules/server/actions'
import { getInfo } from '../../modules/server/selectors'
import { RootState } from '../../types'
import StoragePage from './StoragePage'

const StoragePageContainer: React.FC = () => {
  const dispatch = useDispatch()

  const wallet = useSelector(getWallet)
  const isConnectedValue = useSelector(isConnected)
  const isConnectingValue = useSelector(isConnecting)
  const signed = useSelector((state: RootState) => !!getSignature(state))
  const isSigning = useSelector(isSigningTx)
  const info = useSelector(getInfo)
  const error = useSelector((state: RootState) => state.signature.error)

  const handleSignContent = useCallback(
    (cid: string) => dispatch(signStorageRequest(cid)),
    [dispatch],
  )
  const handleFetchInfo = useCallback(
    () => dispatch(fetchInfoRequest()),
    [dispatch],
  )

  return (
    <StoragePage
      wallet={wallet}
      isConnected={isConnectedValue}
      isConnecting={isConnectingValue}
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
