import { getConnectedProvider } from 'decentraland-dapps/dist/lib/eth'
import { Provider } from 'decentraland-dapps/dist/modules/wallet/types'
import { expectSaga } from 'redux-saga-test-plan'
import { call } from 'redux-saga/effects'
import {
  signContentFailure,
  signContentRequest,
  signContentSuccess,
} from './actions'
import { signatureSaga } from './sagas'
// import { Web3Provider } from '@ethersproject/providers'

jest.mock('@ethersproject/providers')

describe.skip('signature sagas', () => {
  const error = 'error'

  describe('when handling the fetch info request', () => {
    describe('when the request fails', () => {
      it('should dispatch an action signaling the failure of the action', () => {
        return expectSaga(signatureSaga)
          .provide([
            [call(getConnectedProvider), Promise.reject(new Error(error))],
          ])
          .put(signContentFailure(error))
          .dispatch(signContentRequest('cid'))
          .run({ silenceTimeout: true })
      })
    })

    describe('when the request succeeds', () => {
      it('should dispatch an action signaling the success of the action', () => {
        return expectSaga(signatureSaga)
          .provide([[call(getConnectedProvider), {} as Provider]])
          .put(signContentSuccess(''))
          .dispatch(signContentRequest('cid'))
          .run({ silenceTimeout: true })
      })
    })
  })
})
