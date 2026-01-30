import { Badge, Color } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

type NetworkBadgeProps = {
  isTestNet: boolean
}

export const NetworkBadge = ({ isTestNet }: NetworkBadgeProps) => (
  <div className="address-header">
    <Badge color={Color.SHADOWS}>
      {isTestNet ? t('global.network.sepolia') : t('global.network.mainnet')}
    </Badge>
  </div>
)
