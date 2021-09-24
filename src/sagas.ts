import { all } from 'redux-saga/effects'

import { landSaga } from './modules/land/sagas'
import { walletSaga } from './modules/wallet/sagas'
import { signatureSaga } from './modules/signature/sagas'
import { authorizationSaga } from './modules/authorization/sagas'

export function rootSaga() {
  return function*() {
    yield all([walletSaga(), landSaga(), signatureSaga(), authorizationSaga()])
  }
}
