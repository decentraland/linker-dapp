import { Container } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Info } from '../../../modules/server/reducer'

type LogsCardProps = {
  info: Info
}

export const LogsCard = ({ info }: LogsCardProps) => {
  const worldName = info.world ? `${info.world}.dcl.eth` : 'Unknown World'

  return (
    <Container className="serverlogs-card-container">
      <div className="serverlogs-card">
        <h2 className="serverlogs-title">{t('server_logs_page.card.title')}</h2>
        <div className="serverlogs-description">
          <p>
            {t('server_logs_page.card.description_intro')}{' '}
            <span>{t('server_logs_page.card.description_action')}</span>{' '}
            {t('server_logs_page.card.description_service')}
          </p>
          <p className="world-highlight">{worldName}</p>
          <p>
            {t('server_logs_page.card.description_signature')}{' '}
            <span>
              {t('server_logs_page.card.description_signature_purpose')}
            </span>
            .
          </p>
          <p>{t('server_logs_page.card.description_no_transaction')}</p>
        </div>
        <div className="serverlogs-footer">
          <p className="info-text">{t('server_logs_page.footer.info')}</p>
          <p className="info-text secondary">
            {t('server_logs_page.footer.hint')}
          </p>
        </div>
      </div>
    </Container>
  )
}
