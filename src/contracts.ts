import { Contract } from '@ethersproject/contracts'
import { getConnectedProvider } from 'decentraland-dapps/dist/lib/eth'
import { Web3Provider } from '@ethersproject/providers'

import * as EstateRegistry from './abis/EstateRegistry.json'
import * as LANDRegistry from './abis/LANDRegistry.json'
import { isTestnet } from './config'

const contractInstances: {
  land?: Contract
  estate?: Contract
} = {}

export async function getLandContract(landRegistry?: string) {
  if (!contractInstances.land) {
    const provider = await getConnectedProvider()
    if (provider) {
      const address =
        landRegistry ||
        (isTestnet() ? '0x25b6B4bac4aDB582a0ABd475439dA6730777Fbf7' : '0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d')
      contractInstances.land = new Contract(address, LANDRegistry.abi, new Web3Provider(provider).getSigner())
    }
  }

  return contractInstances.land
}

export async function getEstateContract(estateRegistry?: string) {
  if (!contractInstances.estate) {
    const provider = await getConnectedProvider()
    if (provider) {
      const address =
        estateRegistry ||
        (isTestnet() ? '0xC9A46712E6913c24d15b46fF12221a79c4e251DC' : '0x959e104e1a4db6317fa58f8295f586e1a978c297')
      contractInstances.estate = new Contract(address, EstateRegistry.abi, new Web3Provider(provider).getSigner())
    }
  }

  return contractInstances.estate
}
