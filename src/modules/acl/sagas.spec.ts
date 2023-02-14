import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { expectSaga } from 'redux-saga-test-plan'
import { call, select } from 'redux-saga/effects'
import {
  fetchInfoFailure,
  fetchInfoRequest,
  fetchInfoSuccess,
  fetchWorldACLFailure,
  fetchWorldACLRequest,
  fetchWorldACLSuccess,
  updateWorldACLFailure,
  updateWorldACLRequest,
  updateWorldACLSuccess,
} from './actions'
import { ACLResponse } from './reducer'
import { aclSaga } from './sagas'
import { InfoResponse } from './types'
import { getInfoRequest, getWorldACL, updateWorldACL } from './utils'

describe('acl sagas', () => {
  const error = 'error'

  describe('when handling the fetch info request', () => {
    describe('when the request fails', () => {
      it('should dispatch an action signaling the failure of the action', () => {
        return expectSaga(aclSaga)
          .provide([[call(getInfoRequest), Promise.reject(new Error(error))]])
          .put(fetchInfoFailure(error))
          .dispatch(fetchInfoRequest())
          .run({ silenceTimeout: true })
      })
    })

    describe('when the request succeeds', () => {
      const info = {} as InfoResponse
      it('should dispatch an action signaling the success of the action', () => {
        return expectSaga(aclSaga)
          .provide([[call(getInfoRequest), info]])
          .put(fetchInfoSuccess(info))
          .dispatch(fetchInfoRequest())
          .run({ silenceTimeout: true })
      })
    })
  })

  describe('when handling the fetch world ACL request', () => {
    const targetContent = 'targetContent'
    const worldName = 'worldName'

    describe('when the request fails', () => {
      it('should dispatch an action signaling the failure of the action', () => {
        return expectSaga(aclSaga)
          .provide([
            [
              call(getWorldACL, targetContent, worldName),
              Promise.reject(new Error(error)),
            ],
          ])
          .put(fetchWorldACLFailure(error))
          .dispatch(fetchWorldACLRequest(targetContent, worldName))
          .run({ silenceTimeout: true })
      })
    })

    describe('when the request succeeds', () => {
      const acl = {} as ACLResponse
      it('should dispatch an action signaling the success of the action', () => {
        return expectSaga(aclSaga)
          .provide([[call(getWorldACL, targetContent, worldName), acl]])
          .put(fetchWorldACLSuccess(acl))
          .dispatch(fetchWorldACLRequest(targetContent, worldName))
          .run({ silenceTimeout: true })
      })
    })
  })

  describe('when handling the update world ACL request', () => {
    const signature = 'signature'
    const address = '0xaddress'

    describe('when the request fails', () => {
      it('should dispatch an action signaling the failure of the action', () => {
        return expectSaga(aclSaga)
          .provide([
            [select(getAddress), address],
            [
              call(updateWorldACL, { signature, address }),
              Promise.reject(new Error(error)),
            ],
          ])
          .put(updateWorldACLFailure(error))
          .dispatch(updateWorldACLRequest(signature))
          .run({ silenceTimeout: true })
      })
    })

    describe('when the request succeeds', () => {
      const acl = {} as ACLResponse
      it('should dispatch an action signaling the success of the action', () => {
        return expectSaga(aclSaga)
          .provide([
            [select(getAddress), address],
            [call(updateWorldACL, { signature, address }), null],
          ])
          .put(updateWorldACLSuccess())
          .dispatch(updateWorldACLRequest(signature))
          .run({ silenceTimeout: true })
      })
    })
  })
})
