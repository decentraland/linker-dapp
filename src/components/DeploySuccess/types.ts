import { CatalystResponse, Info } from '../../modules/server/reducer'

export type Props = {
  catalysts?: CatalystResponse['catalysts']
  status?: CatalystResponse['status']
  info?: Info
  onFetchCatalyst: () => void
  deploySuccess?: boolean
  apiError?: string | null
}

export type MapStateProps = Pick<Props, 'catalysts' | 'status' | 'info' | 'deploySuccess' | 'apiError'>
export type MapDispatchProps = Pick<Props, 'onFetchCatalyst'>
