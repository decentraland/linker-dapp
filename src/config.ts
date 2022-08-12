import { ChainId } from '@dcl/builder-client/node_modules/@dcl/schemas'

export function isTestnet() {
  return (window?.ethereum as any)?.chainId !== '0x1'
}

export function getChainId() {
  return (window?.ethereum as any)?.chainId === '0x1' ? ChainId.ETHEREUM_MAINNET : ChainId.ETHEREUM_GOERLI
}

export function isDevelopment(): boolean {
  return false
}
