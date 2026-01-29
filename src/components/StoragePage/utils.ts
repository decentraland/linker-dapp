import { StorageAction } from '../../modules/server/types'

export type StorageOnlyAction = Exclude<StorageAction, 'view-logs'>

export const formatAddress = (address: string): string => {
  if (address.length <= 10) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const parseAction = (action?: StorageAction): StorageOnlyAction => {
  if (!action || action === 'view-logs') return 'set'
  return action
}

export const formatTargetUrl = (url: string): string => {
  try {
    const parsed = new URL(url)
    return parsed.host
  } catch {
    return url.length > 30 ? `${url.slice(0, 27)}...` : url
  }
}
