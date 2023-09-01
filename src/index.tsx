import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import {
  TranslationProvider,
  WalletProvider,
} from 'decentraland-dapps/dist/providers'

import { initStore } from './store'

import Root from './components/Root'
import WorldACLPage from './components/WorldACLPage'
import QuestsPage from './components/QuestsPage'

import * as locales from './modules/translation/locales'

// Do not move these before other imports
import 'decentraland-ui/lib/styles.css'
import 'decentraland-ui/lib/dark-theme.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
  },
  {
    path: '/acl',
    element: <WorldACLPage />,
  },
  {
    path: '/quests',
    element: <QuestsPage />,
  },
])

// tslint:disable-next-line: no-floating-promises
ReactDOM.render(
  <Provider store={initStore()}>
    <TranslationProvider locales={Object.keys(locales)}>
      <WalletProvider>
        <RouterProvider router={router} />
      </WalletProvider>
    </TranslationProvider>
  </Provider>,
  document.getElementById('root')
)
