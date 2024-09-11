import { expectSaga } from 'redux-saga-test-plan'
import { npsSaga } from './sagas'
import { signContentSuccess } from '../signature/actions'
import { AuthLinkType } from '@dcl/crypto'

declare global {
  interface Window {
    delightedNps4: {
      survey: () => void
    }
  }
}

global.window = Object.create(window)

describe('nps sagas', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'delightedNps4', {
      value: { survey: jest.fn() },
    })
  })

  describe('when handling the action signaling the success of the sign content request', () => {
    it('should reload the page', async () => {
      const authChain = [
        {
          type: AuthLinkType.ECDSA_PERSONAL_EPHEMERAL,
          payload: 'abcd',
          signature: 'signedMessage',
        },
      ]
      return expectSaga(npsSaga)
        .dispatch(signContentSuccess(authChain))
        .silentRun()
        .then(() => {
          expect(window.delightedNps4.survey).toHaveBeenCalled()
        })
    })
  })
})
