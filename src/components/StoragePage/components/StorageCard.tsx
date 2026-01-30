import { Container } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Info } from '../../../modules/server/reducer'
import { StorageOnlyAction, formatAddress, formatTargetUrl } from '../utils'

type CardDetailsProps = {
  info: Info
  action: StorageOnlyAction
  storageType: string
  isClearAction: boolean
  isPlayerType: boolean
  x: number
  y: number
}

const CardTitle = ({
  storageType,
  action,
}: Pick<CardDetailsProps, 'storageType' | 'action'>) => (
  <h2 className="storage-title">
    {t(`storage_page.card.title.${storageType}.${action}`)}
  </h2>
)

const CardDescription = ({
  action,
  storageType,
}: Pick<CardDetailsProps, 'storageType' | 'action'>) => (
  <div className="storage-description">
    <p>
      {t('storage_page.card.description_intro')}{' '}
      <span>{t(`storage_page.card.description.${storageType}.${action}`)}</span>{' '}
      {t('storage_page.card.description_service')}
    </p>
    <p>
      {t('storage_page.card.description_signature')}{' '}
      <span>{t('storage_page.card.description_signature_purpose')}</span>.
    </p>
    <p>{t('storage_page.card.description_no_transaction')}</p>
  </div>
)

const DetailRow = ({
  label,
  children,
}: React.PropsWithChildren<{ label: string }>) => (
  <div className="detail-row">
    <span className="label">{label}</span>
    <span className="value">{children}</span>
  </div>
)

const CardDetails = ({
  info,
  action,
  storageType,
  isClearAction,
  isPlayerType,
  x,
  y,
}: CardDetailsProps) => (
  <div className="storage-details">
    <DetailRow label={t('storage_page.card.labels.target_url')}>
      <span className="target-url-value">
        {formatTargetUrl(info.targetUrl ?? 'https://storage.decentraland.org')}
      </span>
    </DetailRow>

    <DetailRow label={t('storage_page.card.labels.action')}>
      <span>
        {t(`storage_page.card.info_action.${storageType}.${action}`, {
          count: isPlayerType && info.address ? 1 : 0,
        })}
      </span>
    </DetailRow>

    {!isClearAction && info.key && (
      <DetailRow label={t('storage_page.card.labels.key')}>
        {info.key}
      </DetailRow>
    )}

    {isPlayerType && info.address && (
      <DetailRow label={t('storage_page.card.labels.player_address')}>
        <span className="address-value">{formatAddress(info.address)}</span>
      </DetailRow>
    )}

    <DetailRow
      label={
        info.world
          ? t('storage_page.card.labels.world')
          : t('storage_page.card.labels.parcel')
      }
    >
      <span className="uppercase">{info.world || `${x}, ${y}`}</span>
    </DetailRow>

    <p className="info-text">
      {info.world
        ? t('storage_page.card.info_world')
        : t('storage_page.card.info_parcel')}
    </p>
  </div>
)

const CardFooter = () => (
  <div className="storage-footer">
    <p className="info-text">{t('storage_page.footer.info')}</p>
  </div>
)

export const StorageCard = ({
  info,
  action,
}: Pick<CardDetailsProps, 'info' | 'action'>) => {
  const { x, y } = info.baseParcel
  const storageType = info.storageType ?? 'scene'
  const isClearAction = action === 'clear'
  const isPlayerType = storageType === 'player'

  return (
    <Container className="storage-card-container">
      <div className="storage-card">
        <CardTitle storageType={storageType} action={action} />
        <CardDescription action={action} storageType={storageType} />
        <CardDetails
          info={info}
          action={action}
          storageType={storageType}
          isClearAction={isClearAction}
          isPlayerType={isPlayerType}
          x={x}
          y={y}
        />
        <CardFooter />
      </div>
    </Container>
  )
}
