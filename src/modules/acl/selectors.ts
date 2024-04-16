import { ACLStatus } from '../../components/WorldACLPage/ACLStatus/types'
import { RootState } from '../../types'

export const getState = (state: RootState) => state.acl

export const getInfo = (state: RootState) => getState(state).info
export const getACL = (state: RootState) => getState(state).acl
export const getError = (state: RootState) => getState(state).error

export const isLoading = (state: RootState) => !!getState(state).loading.length

export const getACLStatus = (state: RootState) => {
  const info = getInfo(state)
  const acl = getACL(state)

  if (
    (
      info &&
      acl &&
      info.worldName === acl.resource &&
      info.method === 'put'  && 
      info && acl?.allowed.includes(info.allowed[0].toLowerCase())
    ) || 
    (
      info &&
      acl &&
      info.worldName === acl.resource &&
      info.method === 'delete'  && 
      !(info && acl?.allowed.includes(info.allowed[0].toLowerCase()))
    )
  ) {
    return ACLStatus.UPDATED
  }
  return ACLStatus.UPDATING
}
