import { expectSaga } from 'redux-saga-test-plan'
import { select } from 'redux-saga/effects'
import {
  changeNetwork,
  connectWalletSuccess,
} from 'decentraland-dapps/dist/modules/wallet/actions'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { fetchAuthorizationsRequest } from '../authorization/actions'
import { walletSaga } from './sagas'

global.window = Object.create(window)

describe('wallet sagas', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: { reload: jest.fn() },
    })
  })

  describe('when handling the change of the network', () => {
    it('should reload the page', async () => {
      return expectSaga(walletSaga)
        .dispatch(changeNetwork({} as Wallet))
        .silentRun()
        .then(() => {
          expect(window.location.reload).toHaveBeenCalled()
        })
    })
  })

  describe('when handling the action signaling the success of the connect wallet request', () => {
    const address = '0xaddress'
    it('should dispatch an action signaling the fetch authorization request', () => {
      return expectSaga(walletSaga)
        .provide([[select(getAddress), address]])
        .put(fetchAuthorizationsRequest(address))
        .dispatch(connectWalletSuccess({} as Wallet))
        .run({ silenceTimeout: true })
    })
  })
})
