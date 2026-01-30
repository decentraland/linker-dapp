import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { AnyAction } from 'redux'
import {
  getData as getWallet,
  isConnected as isConnectedSelector,
  isConnecting as isConnectingSelector,
} from 'decentraland-dapps/dist/modules/wallet/selectors'
import {
  getData as getSignature,
  isLoading as isSigningTx,
} from '../modules/signature/selectors'
import { fetchInfoRequest } from '../modules/server/actions'
import { getInfo } from '../modules/server/selectors'
import { RootState } from '../types'

export const useSignaturePage = (signAction: (cid: string) => AnyAction) => {
  const dispatch = useDispatch()

  const wallet = useSelector(getWallet)
  const isConnected = useSelector(isConnectedSelector)
  const isConnecting = useSelector(isConnectingSelector)
  const signed = useSelector((state: RootState) => !!getSignature(state))
  const isSigning = useSelector(isSigningTx)
  const info = useSelector(getInfo)
  const error = useSelector((state: RootState) => state.signature.error)

  const handleSignContent = useCallback(
    (cid: string) => dispatch(signAction(cid)),
    [dispatch, signAction],
  )

  const handleFetchInfo = useCallback(
    () => dispatch(fetchInfoRequest()),
    [dispatch],
  )

  return {
    wallet,
    isConnected,
    isConnecting,
    signed,
    isSigning,
    info,
    error,
    handleSignContent,
    handleFetchInfo,
  }
}
