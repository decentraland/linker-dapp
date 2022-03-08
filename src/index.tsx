import ReactDOM from 'react-dom'
import WalletProvider from 'decentraland-dapps/dist/providers/WalletProvider'
import { Provider } from 'react-redux'

import { initStore } from './store'

import 'decentraland-ui/lib/styles.css'
import 'decentraland-ui/lib/dark-theme.css'
import Root from './components/Root'

// tslint:disable-next-line: no-floating-promises
ReactDOM.render(
  <Provider store={initStore()}>
    <WalletProvider>
      <Root />
    </WalletProvider>
  </Provider>,
  document.getElementById('root')
)
