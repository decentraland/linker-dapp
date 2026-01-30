import { Badge, Color } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { StorageType } from '../../../modules/server/types'
import { SignatureHeader } from '../../SignatureHeader'

type StorageHeaderProps = {
  wallet: Partial<Wallet> | null
  isConnected: boolean
  isConnecting: boolean
  isSigning: boolean
  signed: boolean
  world?: string
  baseParcel: { x: number; y: number }
  storageType?: StorageType
  targetUrl?: string
  rootCID?: string
  onSignContent: (cid: string) => void
}

const LocationBadge = ({
  world,
  baseParcel,
}: Pick<StorageHeaderProps, 'world' | 'baseParcel'>) => (
  <div className="address-header">
    <Badge color={Color.SUMMER_RED}>
      {world || `${baseParcel.x}, ${baseParcel.y}`}
    </Badge>
  </div>
)

const StorageTypeBadge = ({
  storageType,
}: Pick<StorageHeaderProps, 'storageType'>) => (
  <div className="address-header">
    <Badge color={Color.BLUISH_STEEL}>
      {t(`storage_page.storage_types.${storageType}`)}
    </Badge>
  </div>
)

export const StorageHeader = ({
  wallet,
  isConnected,
  isConnecting,
  isSigning,
  signed,
  world,
  baseParcel,
  storageType,
  rootCID,
  onSignContent,
}: StorageHeaderProps) => {
  const badges = (
    <>
      <LocationBadge world={world} baseParcel={baseParcel} />
      {storageType && <StorageTypeBadge storageType={storageType} />}
    </>
  )

  return (
    <SignatureHeader
      titleKey="storage_page.header.title"
      descriptionKey="storage_page.header.description"
      signButtonKey="storage_page.header.sign_button"
      badges={badges}
      wallet={wallet}
      isConnected={isConnected}
      isConnecting={isConnecting}
      isSigning={isSigning}
      signed={signed}
      rootCID={rootCID}
      onSignContent={onSignContent}
    />
  )
}
