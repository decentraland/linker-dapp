import ReactDOM from 'react-dom'
import { TranslationProvider, WalletProvider } from 'decentraland-dapps/dist/providers'
import { Provider } from 'react-redux'

import { initStore } from './store'

import Root from './components/Root'

import * as locales from './modules/translation/locales'

// Do not move these before other imports
import 'decentraland-ui/lib/styles.css'
import 'decentraland-ui/lib/dark-theme.css'

// tslint:disable-next-line: no-floating-promises
ReactDOM.render(
  <Provider store={initStore()}>
    <TranslationProvider locales={Object.keys(locales)}>
      <WalletProvider>
        <Root />
      </WalletProvider>
    </TranslationProvider>
  </Provider>,
  document.getElementById('root')
)
