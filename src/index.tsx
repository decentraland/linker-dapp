import ReactDOM from 'react-dom'
import WalletProvider from 'decentraland-dapps/dist/providers/WalletProvider'
import { Provider } from 'react-redux'

import { initStore } from './store'

import Root from './components/Root'

// Do not move these before other imports
import 'decentraland-ui/lib/styles.css'
import 'decentraland-ui/lib/dark-theme.css'

// tslint:disable-next-line: no-floating-promises
ReactDOM.render(
  <Provider store={initStore()}>
    <WalletProvider>
      <div></div>
      <Root />
      <Div style={{ display: '1' }} ></Div>
    </WalletProvider>
  </Provider>,
  document.getElementById('root')
)