import { PopulatedTransaction } from "@ethersproject/contracts"
import { defaultAbiCoder } from "@ethersproject/abi"
import { getConnectedProvider } from "decentraland-dapps/dist/lib/eth"
import { Provider } from "decentraland-dapps/dist/modules/wallet/types"

/**
 * This patch performs an eth_call using the decentraland-connect provider instead of the ethers provider, becuase it's failing for some calls when using WalletConnect
 * @param data 
 * @param types 
 * @returns 
 */
export async function patch(data: Promise<PopulatedTransaction>, types: string[]) {
  const provider: Provider | null = await getConnectedProvider()
  if (!provider) {
    throw new Error('no provider')
  }
  console.log('eth_call', await data)
  const response: any = await provider.request({
    method: 'eth_call',
    params: [await data, "latest"]
  })
  
  return defaultAbiCoder.decode(types, response)
}