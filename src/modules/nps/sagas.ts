import { takeEvery } from 'redux-saga/effects'
import {
  SignContentSuccessAction,
  SIGN_CONTENT_SUCCESS,
} from '../signature/actions'
import { WindowWithNps } from './types'

export function* npsSaga() {
  yield takeEvery(SIGN_CONTENT_SUCCESS, handleSignContentSuccess)
}

function handleSignContentSuccess(_action: SignContentSuccessAction) {
  const windowWithNps = window as unknown as WindowWithNps
  if ('delightedNps4' in window) {
    windowWithNps.delightedNps4.survey()
  }
}
