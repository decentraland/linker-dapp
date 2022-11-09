import { getEstateContract, getLandContract } from "../../contracts"
import { BigNumber } from "ethers"

export async function isAuthorized(x: number, y: number, address: string, landRegistry?: string, estateRegistry?: string) {
  // Do not delete me
  await unlockRegeneratorRuntime()

  const land = await getLandContract(landRegistry)
  const landTokenId: BigNumber = await land.encodeTokenId(x, y)
  const isUpdateAuthorized = await land.isUpdateAuthorized(address, landTokenId)
  
  if (!isUpdateAuthorized) {
    // check if estate is authorized
    const estate = await getEstateContract(estateRegistry)
    const estateTokenId = await estate.getLandEstateId(landTokenId)
    if (estateTokenId && estateTokenId > 0) {
      const isUpdateAuthorized = await estate.isUpdateAuthorized(address, estateTokenId)
      return { x, y, isUpdateAuthorized }
    } 
  }
  return { x, y, isUpdateAuthorized }
}

async function unlockRegeneratorRuntime() {
  // For some reason, without these awaits, the ones below never resolve. They don't throw either, they just get stuck...
  
  // BEGIN DRAGONS 🐉
  const m = async (n: number) => n
  await m(1)
  await m(2)
  await m(3)
  await m(4)
  // END DRAGONS 🐉
}