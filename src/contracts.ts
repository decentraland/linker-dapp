import { Contract } from '@ethersproject/contracts'
import { getConnectedProvider } from 'decentraland-dapps/dist/lib/eth'
import { Web3Provider } from '@ethersproject/providers'

import * as EstateRegistry from './abis/EstateRegistry.json'
import * as LANDRegistry from './abis/LANDRegistry.json'
import { getConfig, isRopsten } from './config'

const contractInstances: {
  land?: Contract
  estate?: Contract
} = {}


export async function getLandContract() {
  if (!contractInstances.land) {
    const provider = await getConnectedProvider()
    if (provider) {
      const landRegistry = getConfig('landRegistry')
      const address =
        landRegistry ||
        (isRopsten()
          ? '0x7a73483784ab79257bb11b96fd62a2c3ae4fb75b'
          : '0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d')
      contractInstances.land = new Contract(
        address,
        LANDRegistry.abi,
        new Web3Provider(provider).getSigner()
      )
    }
  }

  return contractInstances.land
}

export async function getEstateContract() {
  if (!contractInstances.estate) {
    const provider = await getConnectedProvider()
    if (provider) {
      const estateRegistry = getConfig('landRegistry')
      const address =
        estateRegistry ||
        (isRopsten()
          ? '0x124bf28a423b2ca80b3846c3aa0eb944fe7ebb95'
          : '0x959e104e1a4db6317fa58f8295f586e1a978c297')
      contractInstances.estate = new Contract(
        address,
        EstateRegistry.abi,
        new Web3Provider(provider).getSigner()
      )
    }
  }

  return contractInstances.estate
}
