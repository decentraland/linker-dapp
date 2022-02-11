import { getConfig } from '../../config'
import { Props } from './types'

export default function LandInfo({ deployUrl, base }: Props) {
  const name = base.name ? `"${base.name}"` : `LAND without name`

  const { x, y } = getConfig('baseParcel')

  return (
    <p>
      Updating <b>{name}</b>{' '}
      <a href={deployUrl} target="_blank" rel="noreferrer">
        at coordinates {x}, {y}
      </a>
    </p>
  )
}
