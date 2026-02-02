import { Badge, Color, Icon } from 'decentraland-ui'

type LocationBadgeProps = {
  world?: string
  baseParcel?: { x: number; y: number }
  showIcon?: boolean
}

export const LocationBadge = ({
  world,
  baseParcel,
  showIcon = true,
}: LocationBadgeProps) => (
  <div className="address-header">
    <Badge color={Color.SUMMER_RED}>
      {showIcon ? world ? <Icon name="globe" /> : <Icon name="point" /> : null}{' '}
      {world || `${baseParcel?.x}, ${baseParcel?.y}`}
    </Badge>
  </div>
)
