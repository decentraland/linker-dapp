import { Coords } from './types'

export function coordsToString({ x, y }: Coords): string {
  return `${x},${y}`
}
