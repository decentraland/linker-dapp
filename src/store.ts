import { applyMiddleware, compose, createStore } from 'redux'
import createSagasMiddleware from 'redux-saga'
import { createLogger } from 'redux-logger'
import { createTransactionMiddleware } from 'decentraland-dapps/dist/modules/transaction/middleware'
import { createStorageMiddleware } from 'decentraland-dapps/dist/modules/storage/middleware'

import { rootReducer } from './reducer'
import { rootSaga } from './sagas'

export function initStore() {
  const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

  const { storageMiddleware, loadStorageMiddleware } = createStorageMiddleware({
    storageKey: 'decentraland-linker'
  })
  const sagasMiddleware = createSagasMiddleware()
  const transactionMiddleware = createTransactionMiddleware()
  const loggerMiddleware = createLogger({
    collapsed: () => true,
    predicate: (_, _action) => true
  })

  const middleware = applyMiddleware(sagasMiddleware, loggerMiddleware, storageMiddleware, transactionMiddleware)

  const enhancer = composeEnhancers(middleware)
  const store = createStore(rootReducer, enhancer)

  sagasMiddleware.run(rootSaga())
  loadStorageMiddleware(store)

  return store
}
