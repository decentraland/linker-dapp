import { CatalystResponse } from '../../modules/server/reducer'

export type Props = {
  catalysts?: CatalystResponse['catalysts']
  status?: CatalystResponse['status']
  onFetchCatalyst: () => void
}

export type MapStateProps = Pick<Props, 'catalysts' | 'status'>
export type MapDispatchProps = Pick<Props, 'onFetchCatalyst'>
