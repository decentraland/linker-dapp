import { Container, Header } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

export const SuccessCard = () => (
  <Container className="success-container">
    <div className="success-card">
      <Header size="medium">{t('server_logs_page.success.title')}</Header>
      <p>{t('server_logs_page.success.message')}</p>
      <p className="secondary-text">{t('server_logs_page.success.hint')}</p>
    </div>
  </Container>
)
