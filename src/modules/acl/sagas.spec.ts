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
  putWorldACLFailure,
  putWorldACLRequest,
  putWorldACLSuccess,
} from './actions'
import { WorldPermissionsResponse } from './reducer'
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
      const acl = {} as WorldPermissionsResponse
      it('should dispatch an action signaling the success of the action', () => {
        return expectSaga(aclSaga)
          .provide([[call(getWorldACL, targetContent, worldName), acl]])
          .put(fetchWorldACLSuccess(acl, worldName))
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
              call(updateWorldACL, { signature, address }, 'put'),
              Promise.reject(new Error(error)),
            ],
          ])
          .put(putWorldACLFailure(error))
          .dispatch(putWorldACLRequest(signature))
          .run({ silenceTimeout: true })
      })
    })

    describe('when the request succeeds', () => {
      const acl = {} as WorldPermissionsResponse
      it('should dispatch an action signaling the success of the action', () => {
        return expectSaga(aclSaga)
          .provide([
            [select(getAddress), address],
            [call(updateWorldACL, { signature, address }, 'put'), null],
          ])
          .put(putWorldACLSuccess())
          .dispatch(putWorldACLRequest(signature))
          .run({ silenceTimeout: true })
      })
    })
  })
})
