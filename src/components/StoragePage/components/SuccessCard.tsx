import { Container, Header } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { StorageOnlyAction } from '../utils'
import { StorageType } from '../../../modules/server/types'

type SuccessCardProps = {
  action: StorageOnlyAction
  storageType?: StorageType
}

export const SuccessCard = ({ action, storageType }: SuccessCardProps) => {
  const type = storageType ?? 'scene'

  return (
    <Container className="success-container">
      <div className="success-card">
        <Header size="medium">
          {t(`storage_page.success.${type}.${action}`)}
        </Header>
        <p>
          {t('storage_page.success.operation_complete')}
          <br />
          {t('storage_page.success.close_window')}
        </p>
      </div>
    </Container>
  )
}
