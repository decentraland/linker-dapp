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

  if (info && acl && info.worldName === acl.resource) {
    const isPutMethod = info.method === 'put'
    const isDeleteMethod = info.method === 'delete'
    const isAllowed = acl.allowed.some(
      (aclAllowed) => aclAllowed.toLowerCase() === info.allowed[0].toLowerCase()
    )

    if ((isPutMethod && isAllowed) || (isDeleteMethod && !isAllowed)) {
      return ACLStatus.UPDATED
    }
  }

  return ACLStatus.UPDATING
}
