import { Coord } from 'decentraland-ui'
import { Authorization } from '../../modules/authorization/types'

// eslint-disable-next-line @typescript-eslint/ban-types
export type Props = {
  authorizations: Authorization[]
  parcels: Coord[]
  baseParcel: Coord
  showAtlas?: boolean
}
export type MapStateProps = Props
export type MapDispatchProps = Props
