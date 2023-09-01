import { all } from 'redux-saga/effects'

import { walletSaga } from './modules/wallet/sagas'
import { signatureSaga } from './modules/signature/sagas'
import { authorizationSaga } from './modules/authorization/sagas'
import { apiSaga } from './modules/server/sagas'
import { translationSaga } from './modules/translation/sagas'
import { npsSaga } from './modules/nps/sagas'
import { aclSaga } from './modules/acl/sagas'
import { questsSaga } from './modules/quests/sagas'

export function rootSaga() {
  return function* () {
    yield all([
      walletSaga(),
      signatureSaga(),
      authorizationSaga(),
      apiSaga(),
      translationSaga(),
      npsSaga(),
      aclSaga(),
      questsSaga(),
    ])
  }
}
