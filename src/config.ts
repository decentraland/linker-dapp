import { ChainId } from '@dcl/schemas'

import { Coords } from './modules/land/types'

type Config = {
  baseParcel: Coords
  parcels: Coords[]
  rootCID: string
  debug: boolean
  estateRegistry?: string
  landRegistry?: string
  chainId: ChainId
}

let config: Config | undefined

function parseCoords(query: string | string[] | null): Coords[] {
  if (!query) return [{ x: 0, y: 0 }]
  const coords = typeof query === 'string' ? [query] : query
  return coords.map(c => {
    const [x, y] = c.split(',')
    return { x: parseInt(x, 10), y: parseInt(y, 10) }
  })
}

type UrlFinder = {
  get: (key: keyof Config) => string | null
  getAll: (key: keyof Config) => string[] | null
}

function setConfig() {
  const searchParams = new URLSearchParams(window.location.search) as UrlFinder
  config = {
    baseParcel: parseCoords(searchParams.get('baseParcel'))[0],
    parcels: parseCoords(searchParams.getAll('parcels')),
    rootCID:
      searchParams.get('rootCID') ||
      'QmPjpPyibbryTCi75zzcdeuPUBcujtEqj43shwKBAdMojy',
    debug: searchParams.get('debug') === 'true',
    estateRegistry: searchParams.get('estateRegistry') as string,
    landRegistry: searchParams.get('landRegistry') as string,
    chainId:
      (window?.ethereum as any)?.chainId === '0x1'
        ? ChainId.ETHEREUM_MAINNET
        : ChainId.ETHEREUM_ROPSTEN
  }
}

export function init() {
  setConfig()
}

export function isRopsten() {
  return (window?.ethereum as any)?.chainId !== '0x1'
}

export function isDevelopment(): boolean {
  return !!config?.debug
}

export function getConfig<T extends keyof Config>(key: T) {
  return (config as Config)[key]
}
