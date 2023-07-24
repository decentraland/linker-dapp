import { Contract } from '@ethersproject/contracts'
import { Web3Provider } from '@ethersproject/providers'
import { ChainId } from '@dcl/schemas'
import { getConnectedProvider } from 'decentraland-dapps/dist/lib/eth'

import * as EstateRegistry from './abis/EstateRegistry.json'
import * as LANDRegistry from './abis/LANDRegistry.json'

export enum ContractName {
  LANDRegistry = 'land',
  EstateRegistry = 'estate'
}

const contractsByChainId: Record<ContractName, Partial<Record<ChainId, { abi: any[], address: string }>>> = {
  [ContractName.LANDRegistry]: {
    [ChainId.ETHEREUM_MAINNET]: {
      address: '0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d',
      abi: LANDRegistry.abi
    },
    [ChainId.ETHEREUM_SEPOLIA]: {
      address: '0x42f4ba48791e2de32f5fbf553441c2672864bb33',
      abi: LANDRegistry.abi
    },
  },
  [ContractName.EstateRegistry]: {
    [ChainId.ETHEREUM_MAINNET]: {
      address: '0x959e104e1a4db6317fa58f8295f586e1a978c297',
      abi: EstateRegistry.abi
    },
    [ChainId.ETHEREUM_SEPOLIA]: {
      address: '0x369a7fbe718c870c79f99fb423882e8dd8b20486',
      abi: EstateRegistry.abi
    }
  }
}

export async function getProvider() {
  const provider = await getConnectedProvider()
  if (!provider) {
    throw new Error('no provider')
  }
  return new Web3Provider(provider)
}

export function getContract(name: ContractName, chainId: ChainId) {
  const contract = contractsByChainId[name][chainId]
  if (!contract) {
    throw new Error(`Contract "${name}" not found for chain id "${chainId}"`)
  }
  return contract
}

export async function getContractByName(name: ContractName) {
  const provider = await getProvider()
  const { chainId } = await provider.getNetwork()
  return getContract(name, chainId)
}

export async function getLandContract(landRegistry?: string) {
  const { address, abi } = await getContractByName(ContractName.LANDRegistry)
  const provider = await getProvider()
  const contract = new Contract(landRegistry || address, abi, provider)
  return contract
}

export async function getEstateContract(estateRegistry?: string) {
  const { address, abi } = await getContractByName(ContractName.EstateRegistry)
  return new Contract(estateRegistry || address, abi, await getProvider())
}
