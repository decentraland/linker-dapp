import { FileSize } from '../../modules/server/reducer'

export type Props = {
  files: FileSize[]
}

export type MapStateProps = Pick<Props, 'files'>
